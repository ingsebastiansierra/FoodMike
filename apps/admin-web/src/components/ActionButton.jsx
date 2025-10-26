import React from 'react'

const ActionButton = ({ icon, label, color, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: 'calc(50% - 8px)',
                minHeight: '100px',
                margin: '4px',
                borderRadius: '12px',
                border: 'none',
                background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '20px',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div style={{ fontSize: '32px' }}>{icon}</div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{label}</div>
        </button>
    )
}

export default ActionButton
