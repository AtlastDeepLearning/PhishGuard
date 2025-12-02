import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import InputArea from './components/InputArea';
import AnalysisPanel from './components/AnalysisPanel';
import ThreatMap from './components/ThreatMap';
import './index.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [currentView, setCurrentView] = useState('scan'); // 'scan', 'map', 'settings'

  const handleAnalysis = (result) => {
    setAnalysisResult(result);
    setIsPanelOpen(true);
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="main-content">
        {currentView === 'scan' && (
          <>
            <InputArea onAnalyze={handleAnalysis} />
            {isPanelOpen && (
              <AnalysisPanel
                result={analysisResult}
                onClear={clearAnalysis}
                onClose={() => setIsPanelOpen(false)}
              />
            )}
          </>
        )}

        {currentView === 'map' && <ThreatMap />}

        {currentView === 'settings' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Settings Panel (Coming Soon)
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
