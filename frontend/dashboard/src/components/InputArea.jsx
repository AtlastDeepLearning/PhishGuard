import React, { useState } from 'react';
import { Paperclip } from 'lucide-react';
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
            <div className="drop-zone">
                {/* Placeholder for drop zone visual */}
                <span>Drag & Drop files here</span>
            </div>

            <div className="input-bar-container">
                <Paperclip className="input-icon" size={20} />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="input-bar"
                        placeholder="Paste an email, URL, or message to check for phishing"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                </form>
            </div>

            <p className="disclaimer">
                PhishGuard provides AI-powered phishing awareness and checks using public threat intelligence. Results may not be 100% accurate.
            </p>
        </div>
    );
};

export default InputArea;
