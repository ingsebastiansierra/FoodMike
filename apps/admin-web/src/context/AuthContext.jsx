import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userRole, setUserRole] = useState(null)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        // Obtener sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                loadUserProfile(session.user.id)
            } else {
                setLoading(false)
            }
        })

        // Escuchar cambios de autenticación
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                loadUserProfile(session.user.id)
            } else {
                setUserRole(null)
                setProfile(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const loadUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, role, full_name, email, restaurant_id')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error al cargar perfil:', error)
                setUserRole('cliente')
            } else if (data) {
                setUserRole(data.role || 'cliente')
                setProfile(data)
            }
        } catch (error) {
            console.error('Error inesperado:', error)
            setUserRole('cliente')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
            })

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Correo o contraseña incorrectos')
                } else if (error.message.includes('Email not confirmed')) {
                    // En desarrollo, solo mostrar advertencia pero permitir acceso
                    console.warn('⚠️ Email no verificado - Modo desarrollo')
                    // throw new Error('Por favor verifica tu correo electrónico')
                } else {
                    throw new Error('Error al iniciar sesión')
                }
            }

            return data.user
        } catch (error) {
            throw error
        }
    }

    const register = async (email, password, fullName) => {
        try {
            console.log('🔵 Intentando registrar:', email)

            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: {
                    data: {
                        full_name: fullName?.trim() || '',
                    },
                },
            })

            if (error) {
                console.error('❌ Error de Supabase:', error)

                // Mensajes de error más específicos
                if (error.message.includes('Email signups are disabled')) {
                    throw new Error('⚠️ El registro está desactivado en Supabase. Ve a Authentication → Providers → Email y activa "Enable Email provider"')
                } else if (error.message.includes('User already registered') ||
                    error.message.includes('already registered')) {
                    throw new Error('Este correo ya está registrado')
                } else if (error.message.includes('invalid') ||
                    error.message.includes('Invalid')) {
                    throw new Error('Email o contraseña inválidos')
                } else if (error.message.includes('Password')) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres')
                } else if (error.message.includes('Email rate limit exceeded')) {
                    throw new Error('Demasiados intentos. Espera un momento e intenta de nuevo')
                } else {
                    // Mostrar el error real para debugging
                    throw new Error(error.message || 'Error al registrarse')
                }
            }

            // En desarrollo, no mostrar mensaje de verificación
            console.log('✅ Usuario registrado:', data.user?.email)

            return data.user
        } catch (error) {
            console.error('❌ Error en register:', error)
            throw error
        }
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    const value = {
        user,
        session,
        loading,
        userRole,
        profile,
        isAuthenticated: !!user,
        isAdmin: userRole === 'administrador',
        isClient: userRole === 'cliente',
        isRestaurantAdmin: userRole === 'administradorRestaurante',
        login,
        register,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
