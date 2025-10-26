import React from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import RestaurantDashboard from './pages/RestaurantDashboard'
import RestaurantOnboarding from './pages/RestaurantOnboarding'
import RestaurantApproval from './pages/RestaurantApproval'

// Componente para proteger rutas
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, loading, userRole } = useAuth()

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</div>
                    <div style={{ fontSize: '18px', color: '#757575' }}>Cargando...</div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && userRole !== requiredRole && userRole !== 'administrador') {
        return <Navigate to="/" replace />
    }

    return children
}

// Componente de navegación
const Navigation = () => {
    const { logout, user, userRole, profile } = useAuth()
    const location = useLocation()

    const handleLogout = async () => {
        if (window.confirm('¿Cerrar sesión?')) {
            try {
                await logout()
            } catch (error) {
                alert('Error al cerrar sesión')
            }
        }
    }

    return (
        <nav style={{
            backgroundColor: '#fff',
            padding: '16px 24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B35', margin: 0 }}>
                    TOC TOC Admin
                </h1>

                {userRole === 'administrador' && (
                    <Link
                        to="/admin"
                        style={{
                            textDecoration: 'none',
                            color: '#212121',
                            fontWeight: '600',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: location.pathname === '/admin' ? '#FFE0D6' : 'transparent'
                        }}
                    >
                        👥 Admin General
                    </Link>
                )}

                {(userRole === 'administradorRestaurante' || userRole === 'administrador') && (
                    <Link
                        to="/restaurant"
                        style={{
                            textDecoration: 'none',
                            color: '#212121',
                            fontWeight: '600',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: location.pathname === '/restaurant' ? '#FFE0D6' : 'transparent'
                        }}
                    >
                        🍽️ Admin Restaurante
                    </Link>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>
                        {profile?.full_name || user?.email}
                    </div>
                    <div style={{ fontSize: '12px', color: '#757575' }}>
                        {userRole === 'administrador' ? 'Administrador' :
                            userRole === 'administradorRestaurante' ? 'Admin Restaurante' : 'Usuario'}
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#FF6B6B',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}
                >
                    Salir
                </button>
            </div>
        </nav>
    )
}

// Componente principal de rutas
const AppRoutes = () => {
    const { isAuthenticated, userRole, profile } = useAuth()

    // Si el usuario está autenticado pero no tiene restaurante, redirigir a onboarding
    const needsOnboarding = isAuthenticated && !profile?.restaurant_id && userRole === 'cliente'

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />

            <Route
                path="/onboarding"
                element={
                    <ProtectedRoute>
                        <RestaurantOnboarding />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        {needsOnboarding ? (
                            <Navigate to="/onboarding" replace />
                        ) : (
                            <Navigate
                                to={userRole === 'administrador' ? '/admin' : '/restaurant'}
                                replace
                            />
                        )}
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute requiredRole="administrador">
                        <>
                            <Navigation />
                            <AdminDashboard />
                        </>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/restaurants"
                element={
                    <ProtectedRoute requiredRole="administrador">
                        <>
                            <Navigation />
                            <RestaurantApproval />
                        </>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/restaurant"
                element={
                    <ProtectedRoute>
                        {needsOnboarding ? (
                            <Navigate to="/onboarding" replace />
                        ) : (
                            <>
                                <Navigation />
                                <RestaurantDashboard />
                            </>
                        )}
                    </ProtectedRoute>
                }
            />

            {/* Catch-all route - redirige según el estado del usuario */}
            <Route
                path="*"
                element={
                    <ProtectedRoute>
                        {needsOnboarding ? (
                            <Navigate to="/onboarding" replace />
                        ) : (
                            <Navigate to="/" replace />
                        )}
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
