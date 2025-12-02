import React from 'react';
import { Shield, MessageSquare, Settings, Globe } from 'lucide-react';

const Sidebar = ({ currentView, onNavigate }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <Shield size={32} strokeWidth={2.5} />
                <span>PhishGuard</span>
            </div>

            <div
                className={`nav-item ${currentView === 'scan' ? 'active' : ''}`}
                onClick={() => onNavigate('scan')}
            >
                <MessageSquare size={20} />
                <span>New Scan</span>
            </div>

            <div
                className={`nav-item ${currentView === 'map' ? 'active' : ''}`}
                onClick={() => onNavigate('map')}
            >
                <Globe size={20} />
                <span>Threat Map</span>
            </div>

            <div className="sidebar-footer">
                <div
                    className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
                    onClick={() => onNavigate('settings')}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
