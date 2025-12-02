import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import InputArea from './components/InputArea';
import AnalysisPanel from './components/AnalysisPanel';
import ThreatMap from './components/ThreatMap';
import './index.css';

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentView, setCurrentView] = useState('scan'); // 'scan', 'map', 'settings'

  const handleAnalysis = (userMessage, result) => {
    const newHistory = [
      ...chatHistory,
      { type: 'user', content: userMessage },
      { type: 'bot', content: result }
    ];
    setChatHistory(newHistory);
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="main-content">
        {currentView === 'scan' && (
          <InputArea
            chatHistory={chatHistory}
            onAnalyze={handleAnalysis}
          />
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
