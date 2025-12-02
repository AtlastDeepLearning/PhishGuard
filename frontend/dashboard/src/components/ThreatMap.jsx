import React from 'react';
import { Globe } from 'lucide-react';

const ThreatMap = () => {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 4s infinite ease-in-out'
            }} />

            <Globe size={64} style={{ marginBottom: '24px', color: 'var(--primary-color)', zIndex: 1 }} />
            <h2 style={{ color: 'white', marginBottom: '8px', zIndex: 1 }}>Global Threat Map</h2>
            <p style={{ zIndex: 1 }}>Live threat data visualization coming soon...</p>
        </div>
    );
};

export default ThreatMap;
