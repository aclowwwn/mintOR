
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ChapterList from './pages/ChapterList';
import ChapterDetail from './pages/ChapterDetail';
import ExerciseView from './pages/ExerciseView';
import ContentManagement from './pages/ContentManagement';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chapters" element={<ChapterList />} />
          <Route path="/chapters/:chapterId" element={<ChapterDetail />} />
          <Route path="/chapters/:chapterId/exercise/:exerciseId" element={<ExerciseView />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
