import React from 'react';
import { Trash2, ChevronRight } from 'lucide-react';

const AnalysisPanel = ({ result, onClear, onClose }) => {
    if (!result) return null;

    const { analysis, action } = result;
    const { verdict, score, confidence } = analysis;

    const getScoreColor = (v) => {
        if (v === 'phishing') return 'score-high';
        if (v === 'suspicious') return 'score-med';
        return 'score-low';
    };

    return (
        <div className="analysis-panel">
            <div className="splitter-btn" onClick={onClose}>
                <ChevronRight size={20} />
            </div>

            <div className="panel-header">Analysis Results</div>

            <div className="result-card">
                <h3>Verdict</h3>
                <h2 className={getScoreColor(verdict)}>{verdict.toUpperCase()}</h2>
                <p>Action: <strong>{action}</strong></p>
                <p>Confidence: {(confidence * 100).toFixed(1)}%</p>
                <p>Risk Score: {score.toFixed(2)}</p>
            </div>

            <button className="clear-btn" onClick={onClear}>
                <Trash2 size={16} />
                Clear Analysis
            </button>
        </div>
    );
};

export default AnalysisPanel;
