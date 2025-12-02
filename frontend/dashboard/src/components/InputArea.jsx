import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, User, Bot } from 'lucide-react';
import axios from 'axios';
import AnalysisPanel from './AnalysisPanel';

const InputArea = ({ chatHistory, onAnalyze }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setLoading(true);

        try {
            // Call backend API
            const res = await axios.post('http://127.0.0.1:8000/scan', {
                sender: "user@web-ui",
                subject: "Web Scan",
                body: userMessage
            });
            onAnalyze(userMessage, res.data);
        } catch (error) {
            console.error("Scan failed", error);
            onAnalyze(userMessage, {
                analysis: { verdict: "unknown", score: 0.0, confidence: 0.0 },
                action: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="message-list">
                {chatHistory.length === 0 && (
                    <div className="empty-state">
                        <div className="drop-icon-circle">
                            <Bot size={48} />
                        </div>
                        <h2>How can I help you today?</h2>
                        <p>Paste an email, URL, or message to check for phishing risks.</p>
                    </div>
                )}

                {chatHistory.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.type}`}>
                        <div className="message-avatar">
                            {msg.type === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div className="message-content">
                            {msg.type === 'user' ? (
                                <div className="user-bubble">{msg.content}</div>
                            ) : (
                                <AnalysisPanel result={msg.content} onClose={() => { }} isChatMode={true} />
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message-wrapper bot">
                        <div className="message-avatar"><Bot size={20} /></div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-bar-wrapper">
                <div className="input-bar-container">
                    <Paperclip className="input-icon" size={20} />
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="input-bar"
                            placeholder="Message PhishGuard..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button type="submit" className="send-btn" disabled={!input.trim() || loading}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
                <p className="disclaimer">
                    PhishGuard can make mistakes. Consider checking important info.
                </p>
            </div>
        </div>
    );
};

export default InputArea;
