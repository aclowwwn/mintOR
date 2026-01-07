
import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useI18n } from '../utils/i18n';
import { useAppStore } from '../store';
import { VisualPoint, VisualLine, VisualState } from '../types';

interface GeometryCanvasProps {
  externalState?: VisualState;
}

export interface GeometryCanvasHandle {
  clear: () => void;
  setState: (state: VisualState) => void;
  undo: () => void;
}

const GeometryCanvas = forwardRef<GeometryCanvasHandle, GeometryCanvasProps>(({ externalState }, ref) => {
  const { settings } = useAppStore();
  const t = useI18n(settings.locale);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [points, setPoints] = useState<VisualPoint[]>([]);
  const [lines, setLines] = useState<VisualLine[]>([]);
  const [history, setHistory] = useState<{points: VisualPoint[], lines: VisualLine[]}[]>([]);
  
  // Interaction state
  const [dragStartPos, setDragStartPos] = useState<{ x: number, y: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<{ id: string, type: 'point' | 'line' } | null>(null);
  
  const [snap] = useState(true);
  const [showPointLabels, setShowPointLabels] = useState(true);
  const [showLineLabels, setShowLineLabels] = useState(true);
  const [showPoints, setShowPoints] = useState(true);

  const GRID_SIZE = 25;
  const CLICK_THRESHOLD = 5; // Pixels to distinguish click from drag
  const LINE_HIT_TOLERANCE = 8;

  const saveHistory = (customPoints?: VisualPoint[], customLines?: VisualLine[]) => {
    setHistory(prev => [...prev, { 
      points: customPoints || [...points], 
      lines: customLines || [...lines] 
    }]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setPoints(previousState.points);
    setLines(previousState.lines);
    setHistory(prev => prev.slice(0, prev.length - 1));
    setSelectedElement(null);
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      saveHistory();
      setPoints([]);
      setLines([]);
      setSelectedElement(null);
    },
    setState: (state) => {
      saveHistory();
      setPoints(state.points);
      setLines(state.lines);
      setSelectedElement(null);
    },
    undo: handleUndo
  }));

  useEffect(() => {
    if (externalState) {
      setPoints(externalState.points);
      setLines(externalState.lines);
      setHistory([]);
      setSelectedElement(null);
    }
  }, [externalState]);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e && (e as TouchEvent).touches.length > 0) {
      clientX = (e as TouchEvent).touches[0].clientX;
      clientY = (e as TouchEvent).touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    } else {
      return { x: mousePos.x, y: mousePos.y };
    }
    
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    if (snap) {
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;
    }

    return { x, y };
  };

  const findPointAt = (x: number, y: number, currentPoints: VisualPoint[]) => {
    return currentPoints.find(p => Math.hypot(p.x - x, p.y - y) < 15);
  };

  const findLineAt = (x: number, y: number) => {
    for (const line of lines) {
      const p1 = points.find(p => p.id === line.p1Id);
      const p2 = points.find(p => p.id === line.p2Id);
      if (!p1 || !p2) continue;

      const L2 = Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
      if (L2 === 0) continue;

      const t = ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / L2;
      const clampedT = Math.max(0, Math.min(1, t));
      
      const projX = p1.x + clampedT * (p2.x - p1.x);
      const projY = p1.y + clampedT * (p2.y - p1.y);

      if (Math.hypot(x - projX, y - projY) < LINE_HIT_TOLERANCE) {
        return line;
      }
    }
    return null;
  };

  const getNextPointLabel = (currentPoints: VisualPoint[]) => {
    return String.fromCharCode(65 + (currentPoints.length % 26)) + (currentPoints.length >= 26 ? Math.floor(currentPoints.length / 26) : '');
  };

  const getNextLineLabel = (currentLines: VisualLine[]) => {
    return String.fromCharCode(97 + (currentLines.length % 26)) + (currentLines.length >= 26 ? Math.floor(currentLines.length / 26) : '');
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCanvasPos(e);
    setDragStartPos(pos);
    setMousePos(pos);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCanvasPos(e);
    setMousePos(pos);
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartPos) return;

    const endPos = getCanvasPos(e);
    const dist = Math.hypot(endPos.x - dragStartPos.x, endPos.y - dragStartPos.y);

    if (dist < CLICK_THRESHOLD) {
      const existingPoint = findPointAt(dragStartPos.x, dragStartPos.y, points);
      if (existingPoint) {
        setSelectedElement({ id: existingPoint.id, type: 'point' });
      } else {
        const existingLine = findLineAt(dragStartPos.x, dragStartPos.y);
        if (existingLine) {
          setSelectedElement({ id: existingLine.id, type: 'line' });
        } else {
          // Create new point
          saveHistory();
          const newId = Math.random().toString(36).substr(2, 9);
          const newPoint: VisualPoint = {
            x: dragStartPos.x,
            y: dragStartPos.y,
            id: newId,
            label: getNextPointLabel(points)
          };
          setPoints(prev => [...prev, newPoint]);
          setSelectedElement({ id: newId, type: 'point' });
        }
      }
    } else {
      // Treat as drag: Create a line and points if needed
      saveHistory();
      
      let currentPoints = [...points];
      let startPoint = findPointAt(dragStartPos.x, dragStartPos.y, currentPoints);
      
      if (!startPoint) {
        startPoint = {
          x: dragStartPos.x,
          y: dragStartPos.y,
          id: Math.random().toString(36).substr(2, 9),
          label: getNextPointLabel(currentPoints)
        };
        currentPoints.push(startPoint);
      }

      let endPoint = findPointAt(endPos.x, endPos.y, currentPoints);
      if (!endPoint) {
        endPoint = {
          x: endPos.x,
          y: endPos.y,
          id: Math.random().toString(36).substr(2, 9),
          label: getNextPointLabel(currentPoints)
        };
        currentPoints.push(endPoint);
      }

      if (startPoint.id !== endPoint.id) {
        const lineExists = lines.some(l => 
          (l.p1Id === startPoint!.id && l.p2Id === endPoint!.id) || 
          (l.p1Id === endPoint!.id && l.p2Id === startPoint!.id)
        );

        if (!lineExists) {
          const newId = Math.random().toString(36).substr(2, 9);
          const newLine: VisualLine = {
            p1Id: startPoint.id,
            p2Id: endPoint.id,
            id: newId,
            label: getNextLineLabel(lines)
          };
          setLines(prev => [...prev, newLine]);
          setSelectedElement({ id: newId, type: 'line' });
        }
      }
      setPoints(currentPoints);
    }

    setDragStartPos(null);
  };

  const handleMouseLeave = () => {
    setDragStartPos(null);
  };

  const clearCanvas = () => {
    saveHistory();
    setPoints([]);
    setLines([]);
    setDragStartPos(null);
    setSelectedElement(null);
  };

  const handleRename = (newLabel: string) => {
    if (!selectedElement) return;
    if (selectedElement.type === 'point') {
      setPoints(prev => prev.map(p => p.id === selectedElement.id ? { ...p, label: newLabel } : p));
    } else {
      setLines(prev => prev.map(l => l.id === selectedElement.id ? { ...l, label: newLabel } : l));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = 400;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Grid
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // Lines
      lines.forEach(line => {
        const p1 = points.find(p => p.id === line.p1Id);
        const p2 = points.find(p => p.id === line.p2Id);
        if (p1 && p2) {
          const isSelected = selectedElement?.id === line.id && selectedElement?.type === 'line';
          
          ctx.beginPath();
          ctx.strokeStyle = isSelected ? '#4f46e5' : '#64748b';
          ctx.lineWidth = isSelected ? 5 : 3;
          ctx.lineCap = 'round';
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          if (showLineLabels) {
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.hypot(dx, dy);
            const nx = -dy / (len || 1);
            const ny = dx / (len || 1);
            ctx.fillStyle = isSelected ? '#4f46e5' : '#94a3b8';
            ctx.fillText(line.label, midX + nx * 18, midY + ny * 18);
          }
        }
      });

      // Active Preview
      if (dragStartPos) {
        const dist = Math.hypot(mousePos.x - dragStartPos.x, mousePos.y - dragStartPos.y);
        if (dist >= CLICK_THRESHOLD) {
          ctx.beginPath();
          ctx.strokeStyle = '#c7d2fe';
          ctx.setLineDash([5, 5]);
          ctx.moveTo(dragStartPos.x, dragStartPos.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Points
      points.forEach(point => {
        const isSelected = selectedElement?.id === point.id && selectedElement?.type === 'point';
        
        if (showPoints) {
          // Highlight glow for selected
          if (isSelected) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
            ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.beginPath();
          ctx.fillStyle = isSelected ? '#4f46e5' : '#818cf8';
          ctx.arc(point.x, point.y, isSelected ? 6 : 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (showPointLabels) {
          ctx.fillStyle = isSelected ? '#4f46e5' : '#1e293b';
          ctx.fillText(point.label, point.x + 14, point.y - 14);
        }
      });
    };

    const anim = requestAnimationFrame(function loop() {
      draw();
      requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener('resize', resize);
    };
  }, [points, lines, dragStartPos, mousePos, showPointLabels, showLineLabels, showPoints, selectedElement]);

  const currentLabel = selectedElement 
    ? (selectedElement.type === 'point' 
        ? points.find(p => p.id === selectedElement.id)?.label 
        : lines.find(l => l.id === selectedElement.id)?.label) || ''
    : '';

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div>
            <h4 className="font-black text-slate-900 text-sm tracking-tight">{t.sandboxTitle}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.sandboxDesc}</p>
          </div>
          {selectedElement && (
            <div className="flex items-center bg-white border border-indigo-100 rounded-xl px-2 py-1 animate-fadeIn">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter mr-2">Rename:</span>
              <input 
                type="text"
                value={currentLabel}
                onChange={(e) => handleRename(e.target.value)}
                className="w-16 text-xs font-black text-indigo-600 focus:outline-none placeholder-indigo-200"
                placeholder="..."
                autoFocus
              />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleUndo}
            disabled={history.length === 0}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${history.length > 0 ? 'bg-white text-indigo-600 border-slate-200 hover:border-indigo-200' : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'}`}
          >
            {t.undo}
          </button>
          <button 
            onClick={() => setShowPointLabels(!showPointLabels)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${showPointLabels ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            {t.showPointLabels}
          </button>
          <button 
            onClick={() => setShowLineLabels(!showLineLabels)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${showLineLabels ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            {t.showLineLabels}
          </button>
          <button 
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded-xl bg-white text-red-500 border-2 border-slate-100 text-[10px] font-black uppercase tracking-tight hover:bg-red-50 hover:border-red-100 transition-all"
          >
            {t.clearCanvas}
          </button>
        </div>
      </div>
      <div className="relative flex-1 min-h-[400px] cursor-crosshair touch-none">
        <canvas 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="block w-full h-full"
        />
        {points.length === 0 && !dragStartPos && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none">
            <div className="text-center">
              <div className="text-4xl mb-2">✏️</div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Click to add points or drag to draw lines</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default GeometryCanvas;
