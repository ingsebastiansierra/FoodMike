import React, { useState } from 'react'

const AdminDashboard = () => {
    const [users, setUsers] = useState([
        {
            uid: '1',
            name: 'Juan Pérez',
            email: 'juan@example.com',
            role: 'administrador'
        },
        {
            uid: '2',
            name: 'María García',
            email: 'maria@example.com',
            role: 'cliente'
        },
        {
            uid: '3',
            name: 'Carlos López',
            email: 'carlos@example.com',
            role: 'cliente'
        }
    ])

    const currentUser = {
        uid: '1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'administrador'
    }

    const handleChangeRole = (userId, currentRole) => {
        const newRole = currentRole === 'cliente' ? 'administrador' : 'cliente'
        if (window.confirm(`¿Cambiar rol a ${newRole}?`)) {
            setUsers(users.map(u =>
                u.uid === userId ? { ...u, role: newRole } : u
            ))
            alert('Rol cambiado correctamente')
        }
    }

    const handleLogout = () => {
        if (window.confirm('¿Cerrar sesión?')) {
            alert('Cerrando sesión...')
        }
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B35' }}>
                    Panel de Administrador
                </h1>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#FF6B6B',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>

            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* User Profile */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        backgroundColor: '#FF6B35',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        color: '#fff'
                    }}>
                        👤
                    </div>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#212121' }}>
                            {currentUser.name}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#757575' }}>{currentUser.email}</p>
                        <span style={{
                            display: 'inline-block',
                            marginTop: '8px',
                            padding: '4px 12px',
                            backgroundColor: '#FF6B35',
                            color: '#fff',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}>
                            {currentUser.role}
                        </span>
                    </div>
                </div>

                {/* Quick Stats */}
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF6B35', marginBottom: '16px' }}>
                    Estadísticas Rápidas
                </h2>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                    <div style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#212121' }}>
                            {users.length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#757575' }}>Usuarios Totales</div>
                    </div>
                    <div style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍽️</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#212121' }}>125</div>
                        <div style={{ fontSize: '14px', color: '#757575' }}>Productos</div>
                    </div>
                    <div style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#212121' }}>$1,250</div>
                        <div style={{ fontSize: '14px', color: '#757575' }}>Ventas Hoy</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF6B35', marginBottom: '16px' }}>
                    Acciones Rápidas
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {[
                        { title: 'Gestionar Productos', icon: '📋', color: '#4ECDC4' },
                        { title: 'Ver Pedidos', icon: '🚚', color: '#FFD93D' },
                        { title: 'Reportes', icon: '📊', color: '#667eea' },
                        { title: 'Configuración', icon: '⚙️', color: '#6BCF7F' },
                    ].map((action, index) => (
                        <button
                            key={index}
                            onClick={() => alert(action.title)}
                            style={{
                                padding: '20px',
                                backgroundColor: action.color,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ fontSize: '32px' }}>{action.icon}</div>
                            {action.title}
                        </button>
                    ))}
                </div>

                {/* User Management */}
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF6B35', marginBottom: '16px' }}>
                    Gestión de Usuarios
                </h2>
                {users.map((user) => (
                    <div
                        key={user.uid}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '20px',
                                backgroundColor: user.role === 'administrador' ? '#FF6B35' : '#9E9E9E',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                color: '#fff'
                            }}>
                                👤
                            </div>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#212121' }}>
                                    {user.name || 'Sin nombre'}
                                </div>
                                <div style={{ fontSize: '14px', color: '#757575' }}>{user.email}</div>
                                <span style={{
                                    display: 'inline-block',
                                    marginTop: '4px',
                                    padding: '2px 12px',
                                    backgroundColor: user.role === 'administrador' ? '#FF6B35' : '#9E9E9E',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                        {user.uid !== currentUser.uid && (
                            <button
                                onClick={() => handleChangeRole(user.uid, user.role)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#E0E0E0',
                                    color: '#FF6B35',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                🔄 Cambiar Rol
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminDashboard
