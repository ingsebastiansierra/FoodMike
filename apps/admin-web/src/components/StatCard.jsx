import React from 'react'

const StatCard = ({ icon, label, value, color = '#4ECDC4' }) => {
    return (
        <div style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            margin: '0 8px',
            borderLeft: `4px solid ${color}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        }}>
            <div style={{ fontSize: '32px' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#212121' }}>
                    {value}
                </div>
                <div style={{ fontSize: '12px', color: '#757575', marginTop: '4px' }}>
                    {label}
                </div>
            </div>
        </div>
    )
}

export default StatCard
