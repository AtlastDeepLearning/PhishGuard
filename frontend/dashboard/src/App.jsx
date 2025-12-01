import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import InputArea from './components/InputArea';
import AnalysisPanel from './components/AnalysisPanel';
import './index.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleAnalysis = (result) => {
    setAnalysisResult(result);
    setIsPanelOpen(true);
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <InputArea onAnalyze={handleAnalysis} />
        {isPanelOpen && (
          <AnalysisPanel
            result={analysisResult}
            onClear={clearAnalysis}
            onClose={() => setIsPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
