import React from 'react';
import { Shield, MessageSquare, Settings, Globe } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <Shield size={24} />
                <span>PhishGuard</span>
            </div>

            <div className="nav-item">
                <MessageSquare size={20} />
                <span>New Chat</span>
            </div>

            <div className="sidebar-footer">
                <div className="nav-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
