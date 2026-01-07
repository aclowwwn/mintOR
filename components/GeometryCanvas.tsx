
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
  const [snap] = useState(true);
  const [showPointLabels, setShowPointLabels] = useState(true);
  const [showLineLabels, setShowLineLabels] = useState(true);
  const [showPoints, setShowPoints] = useState(true);

  // Selection state for renaming
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'point' | 'line' | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const GRID_SIZE = 25;
  const CLICK_THRESHOLD = 5; // Pixels to distinguish click from drag

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
    setSelectedId(null);
    setSelectedType(null);
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      saveHistory();
      setPoints([]);
      setLines([]);
      setSelectedId(null);
      setSelectedType(null);
    },
    setState: (state) => {
      saveHistory();
      setPoints(state.points);
      setLines(state.lines);
      setSelectedId(null);
      setSelectedType(null);
    },
    undo: handleUndo
  }));

  useEffect(() => {
    if (externalState) {
      setPoints(externalState.points);
      setLines(externalState.lines);
      setHistory([]);
      setSelectedId(null);
      setSelectedType(null);
    }
  }, [externalState]);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX || 0;
      clientY = e.touches[0]?.clientY || 0;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as