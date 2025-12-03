import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, User, Bot } from 'lucide-react';
import axios from 'axios';
import AnalysisPanel from './AnalysisPanel';

const InputArea = ({ chatHistory, onAnalyze }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, loading]);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() && !selectedFile) return;

        setLoading(true);
        let messageBody = input;
        let displayMessage = input;

        try {
            if (selectedFile) {
                const fileContent = await readFileContent(selectedFile);
                // If there is both text and file, combine them. 
                // For now, we'll append the file content to the text.
                if (messageBody) {
                    messageBody += `\n\n--- File: ${selectedFile.name} ---\n${fileContent}`;
                } else {
                    messageBody = fileContent;
                    displayMessage = `[File: ${selectedFile.name}]`;
                }
            }

            const userMessage = displayMessage;
            setInput('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Call backend API
            const res = await axios.post('http://127.0.0.1:8000/scan', {
                sender: "user@web-ui",
                subject: "Web Scan",
                body: messageBody
            });
            onAnalyze(userMessage, res.data);
        } catch (error) {
            console.error("Scan failed", error);
            onAnalyze(displayMessage || "Error", {
                analysis: { verdict: "unknown", score: 0.0, confidence: 0.0 },
                action: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const readFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
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
                {selectedFile && (
                    <div className="file-preview-chip">
                        <span className="file-name">{selectedFile.name}</span>
                        <button onClick={removeFile} className="remove-file-btn">×</button>
                    </div>
                )}
                <div 
                    className={`input-bar-container ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <Paperclip 
                        className="input-icon" 
                        size={20} 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ cursor: 'pointer' }}
                    />
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="input-bar"
                            placeholder="Message PhishGuard..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button type="submit" className="send-btn" disabled={(!input.trim() && !selectedFile) || loading}>
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
