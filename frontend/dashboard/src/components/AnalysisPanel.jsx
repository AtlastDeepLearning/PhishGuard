import React from 'react';
import { X, ChevronRight, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';

const AnalysisPanel = ({ result, onClear, onClose }) => {
    if (!result) return null;

    const { analysis, action } = result;
    const score = analysis.score || 0;

    let scoreClass = 'score-low';
    let Icon = CheckCircle;

    if (score > 80) {
        scoreClass = 'score-high';
        Icon = AlertTriangle;
    } else if (score > 40) {
        scoreClass = 'score-med';
        Icon = Info;
    }

    return (
        <div className="analysis-panel animate-slide-in">
            <div className="splitter-btn" onClick={onClose}>
                <ChevronRight size={24} />
            </div>

            <div className="panel-header">
                <span>Analysis Report</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            <div className="result-card">
                <div className="score-display">
                    <div className={`score-ring ${scoreClass}`}>
                        {Math.round(score)}
                    </div>
                    <div>
                        <div className="verdict-label">Risk Score</div>
                        <div className="verdict-value">{analysis.verdict || "Unknown"}</div>
                    </div>
                </div>
            </div>

            <div className="result-card">
                <div style={{ marginBottom: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={18} className={scoreClass} />
                    <span>Details</span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Confidence</span>
                    <span className="detail-value">{(analysis.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Action</span>
                    <span className="detail-value" style={{ textTransform: 'capitalize' }}>{action}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Source</span>
                    <span className="detail-value">AI Model</span>
                </div>
            </div>

            <button className="clear-btn" onClick={onClear}>
                <Trash2 size={18} />
                <span>Clear Results</span>
            </button>
        </div>
    );
};

export default AnalysisPanel;
