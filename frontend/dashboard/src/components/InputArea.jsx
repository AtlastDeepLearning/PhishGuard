import React, { useState } from 'react';
import { Paperclip, Search } from 'lucide-react';
import axios from 'axios';

const InputArea = ({ onAnalyze }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        try {
            // Call backend API
            const res = await axios.post('http://127.0.0.1:8000/scan', {
                sender: "user@web-ui", // Placeholder
                subject: "Web Scan",
                body: input
            });
            onAnalyze(res.data);
        } catch (error) {
            console.error("Scan failed", error);
            // Mock result for demo if backend offline
            onAnalyze({
                analysis: { verdict: "unknown", score: 0.0, confidence: 0.0 },
                action: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="input-area">
            <div className={`drop-zone ${loading ? 'scanning-active' : ''}`}>
                <div className="drop-icon-circle">
                    <Paperclip size={32} />
                </div>
                {loading ? (
                    <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-color)' }}>Scanning...</span>
                ) : (
                    <>
                        <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-main)' }}>Drag & Drop files here</span>
                        <span style={{ fontSize: '0.9rem', marginTop: '8px', color: 'var(--text-muted)' }}>or paste text below</span>
                    </>
                )}
            </div>

            <div className="input-bar-container">
                <Search className="input-icon" size={20} />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="input-bar"
                        placeholder="Paste an email, URL, or message to analyze..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                </form>
            </div>

            <p className="disclaimer">
                PhishGuard uses advanced AI and threat intelligence to detect phishing attempts.
                Always verify sensitive requests through official channels.
            </p>
        </div>
    );
};

export default InputArea;
