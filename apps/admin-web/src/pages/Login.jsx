import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isLogin) {
                await login(email, password)
            } else {
                if (!fullName.trim()) {
                    setError('Por favor ingresa tu nombre completo')
                    setLoading(false)
                    return
                }
                if (password !== confirmPassword) {
                    setError('Las contraseñas no coinciden')
                    setLoading(false)
                    return
                }
                if (password.length < 6) {
                    setError('La contraseña debe tener al menos 6 caracteres')
                    setLoading(false)
                    return
                }
                await register(email, password, fullName)
                alert('¡Registro exitoso! Ya puedes iniciar sesión.')
                setIsLogin(true) // Cambiar a la pestaña de login
                setPassword('')
                setConfirmPassword('')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px'
                    }}>
                        🍽️
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#FF6B35',
                        margin: 0
                    }}>
                        TOC TOC Admin
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#757575',
                        marginTop: '8px'
                    }}>
                        Panel de Administración
                    </p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    marginBottom: '24px',
                    borderBottom: '2px solid #E0E0E0'
                }}>
                    <button
                        onClick={() => {
                            setIsLogin(true)
                            setError('')
                            setConfirmPassword('')
                        }}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            background: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: isLogin ? '#FF6B35' : '#757575',
                            borderBottom: isLogin ? '3px solid #FF6B35' : 'none',
                            cursor: 'pointer',
                            marginBottom: '-2px'
                        }}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => {
                            setIsLogin(false)
                            setError('')
                            setPassword('')
                            setConfirmPassword('')
                        }}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            background: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: !isLogin ? '#FF6B35' : '#757575',
                            borderBottom: !isLogin ? '3px solid #FF6B35' : 'none',
                            cursor: 'pointer',
                            marginBottom: '-2px'
                        }}
                    >
                        Registrarse
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#FFEBEE',
                        color: '#C62828',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#212121',
                                marginBottom: '8px'
                            }}>
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Juan Pérez"
                                required={!isLogin}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #E0E0E0',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#212121',
                            marginBottom: '8px'
                        }}>
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                        />
                    </div>

                    <div style={{ marginBottom: isLogin ? '24px' : '16px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#212121',
                            marginBottom: '8px'
                        }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #E0E0E0',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                            onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                        />
                        {!isLogin && (
                            <p style={{
                                fontSize: '12px',
                                color: '#757575',
                                marginTop: '4px'
                            }}>
                                Mínimo 6 caracteres
                            </p>
                        )}
                    </div>

                    {!isLogin && (
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#212121',
                                marginBottom: '8px'
                            }}>
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required={!isLogin}
                                minLength={6}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #E0E0E0',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#FF6B35'}
                                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                            />
                            {confirmPassword && password !== confirmPassword && (
                                <p style={{
                                    fontSize: '12px',
                                    color: '#C62828',
                                    marginTop: '4px'
                                }}>
                                    ⚠️ Las contraseñas no coinciden
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading ? '#BDBDBD' : '#FF6B35',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.target.style.backgroundColor = '#E55A2B'
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.target.style.backgroundColor = '#FF6B35'
                        }}
                    >
                        {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </form>

                {/* Footer */}
                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#757575'
                }}>
                    {isLogin ? (
                        <p>
                            ¿No tienes cuenta?{' '}
                            <button
                                onClick={() => {
                                    setIsLogin(false)
                                    setError('')
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#FF6B35',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Regístrate aquí
                            </button>
                        </p>
                    ) : (
                        <p>
                            ¿Ya tienes cuenta?{' '}
                            <button
                                onClick={() => {
                                    setIsLogin(true)
                                    setError('')
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#FF6B35',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Inicia sesión aquí
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login
