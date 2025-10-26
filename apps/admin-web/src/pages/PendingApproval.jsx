import React from 'react'
import { useAuth } from '../context/AuthContext'

const PendingApproval = () => {
    const { logout, profile } = useAuth()

    const handleLogout = async () => {
        if (window.confirm('¿Cerrar sesión?')) {
            await logout()
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '40px',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                textAlign: 'center'
            }}>
                {/* Icono animado */}
                <div style={{
                    fontSize: '80px',
                    marginBottom: '24px',
                    animation: 'pulse 2s infinite'
                }}>
                    ⏳
                </div>

                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#FF6B35',
                    marginBottom: '16px'
                }}>
                    ¡Registro Exitoso!
                </h1>

                <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#212121',
                    marginBottom: '24px'
                }}>
                    Tu restaurante está en revisión
                </h2>

                <div style={{
                    backgroundColor: '#FFF3E0',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    textAlign: 'left'
                }}>
                    <p style={{
                        fontSize: '14px',
                        color: '#E65100',
                        lineHeight: '1.6',
                        marginBottom: '12px'
                    }}>
                        <strong>📋 ¿Qué sigue?</strong>
                    </p>
                    <ul style={{
                        fontSize: '14px',
                        color: '#E65100',
                        lineHeight: '1.8',
                        paddingLeft: '20px'
                    }}>
                        <li>Nuestro equipo revisará tu información</li>
                        <li>Verificaremos los datos de tu restaurante</li>
                        <li>Te notificaremos por correo cuando sea aprobado</li>
                        <li>El proceso toma entre 24-48 horas</li>
                    </ul>
                </div>

                <div style={{
                    backgroundColor: '#E3F2FD',
                    padding: '20px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    textAlign: 'left'
                }}>
                    <p style={{
                        fontSize: '14px',
                        color: '#1565C0',
                        lineHeight: '1.6',
                        marginBottom: '8px'
                    }}>
                        <strong>📧 Te enviaremos un correo a:</strong>
                    </p>
                    <p style={{
                        fontSize: '16px',
                        color: '#1976D2',
                        fontWeight: '600'
                    }}>
                        {profile?.email}
                    </p>
                </div>

                <div style={{
                    backgroundColor: '#E8F5E9',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '32px'
                }}>
                    <p style={{
                        fontSize: '13px',
                        color: '#2E7D32',
                        lineHeight: '1.6'
                    }}>
                        💡 <strong>Tip:</strong> Mientras esperas, puedes preparar fotos de tus productos y pensar en tu menú. Una vez aprobado, podrás empezar a agregar productos inmediatamente.
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '14px 32px',
                            backgroundColor: '#FF6B6B',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <p style={{
                    fontSize: '12px',
                    color: '#757575',
                    marginTop: '24px'
                }}>
                    ¿Tienes preguntas? Contáctanos a soporte@toctoc.com
                </p>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `}</style>
        </div>
    )
}

export default PendingApproval
