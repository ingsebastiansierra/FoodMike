import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabase'
import StatCard from '../components/StatCard'
import ActionButton from '../components/ActionButton'
import OrderCard from '../components/OrderCard'
import RestaurantProfile from './RestaurantProfile'

const RestaurantDashboard = () => {
    const { profile } = useAuth()
    const [loading, setLoading] = useState(true)
    const [orderFilter, setOrderFilter] = useState('all')
    const [restaurant, setRestaurant] = useState(null)

    useEffect(() => {
        loadRestaurant()
    }, [profile])

    const loadRestaurant = async () => {
        if (!profile?.restaurant_id) {
            setLoading(false)
            return
        }

        try {
            const { data, error } = await supabase
                .from('restaurants')
                .select('status')
                .eq('id', profile.restaurant_id)
                .single()

            if (error) throw error
            setRestaurant(data)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    // Si no está aprobado, mostrar solo el perfil
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ fontSize: '48px' }}>⏳</div>
            </div>
        )
    }

    if (!restaurant || restaurant.status !== 'approved') {
        return <RestaurantProfile />
    }

    // Mock data - reemplazar con llamadas API reales
    const restaurantInfo = {
        name: 'Mi Restaurante',
        status: 'active',
        image: null
    }

    const stats = {
        total_orders: 45,
        total_revenue: 2450000,
        total_products: 28,
        avg_rating: 4.8
    }

    const recentOrders = [
        {
            id: 'abc123def456',
            payment_method: 'wompi',
            status: 'preparing',
            payment_status: 'paid',
            total: 45000,
            created_at: new Date().toISOString()
        },
        {
            id: 'xyz789uvw012',
            payment_method: 'cash',
            status: 'pending',
            payment_status: 'pending',
            total: 32000,
            created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 'mno345pqr678',
            payment_method: 'transfer',
            status: 'ready',
            payment_status: 'paid',
            total: 58000,
            created_at: new Date(Date.now() - 7200000).toISOString()
        }
    ]

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getFilteredOrders = () => {
        if (orderFilter === 'all') return recentOrders
        if (orderFilter === 'paid') {
            return recentOrders.filter(o => o.payment_status === 'paid')
        }
        if (orderFilter === 'pending') {
            return recentOrders.filter(o => o.payment_status === 'pending')
        }
        return recentOrders
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <div style={{
                height: '220px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '40px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    border: '3px solid #fff',
                    fontSize: '40px'
                }}>
                    🍽️
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {restaurantInfo.name}
                </h1>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    {restaurantInfo.status === 'active' ? '🟢 Activo' : '🔴 Inactivo'}
                </div>
            </div>

            {/* Stats */}
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                    <StatCard icon="🛒" label="Pedidos" value={stats.total_orders} color="#4ECDC4" />
                    <StatCard icon="💰" label="Ingresos" value={formatCurrency(stats.total_revenue)} color="#FFD93D" />
                </div>
                <div style={{ display: 'flex', marginBottom: '16px' }}>
                    <StatCard icon="🍔" label="Productos" value={stats.total_products} color="#FF6B6B" />
                    <StatCard icon="⭐" label="Rating" value={stats.avg_rating.toFixed(1)} color="#6BCF7F" />
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                    Acciones Rápidas
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-4px' }}>
                    <ActionButton icon="🎥" label="Crear Short" color="#FF6B6B" onClick={() => alert('Crear Short')} />
                    <ActionButton icon="📹" label="Mis Shorts" color="#9B59B6" onClick={() => alert('Mis Shorts')} />
                    <ActionButton icon="➕" label="Nuevo Producto" color="#667eea" onClick={() => alert('Nuevo Producto')} />
                    <ActionButton icon="📋" label="Ver Productos" color="#4ECDC4" onClick={() => alert('Ver Productos')} />
                    <ActionButton icon="🧾" label="Pedidos" color="#FFD93D" onClick={() => alert('Pedidos')} />
                    <ActionButton icon="⚙️" label="Configuración" color="#6BCF7F" onClick={() => alert('Configuración')} />
                </div>
            </div>

            {/* Recent Orders */}
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Pedidos Recientes</h2>
                    <button style={{
                        fontSize: '14px',
                        color: '#FF6B35',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}>
                        Ver todos
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                        onClick={() => setOrderFilter('all')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: orderFilter === 'all' ? 'none' : '1px solid #E0E0E0',
                            backgroundColor: orderFilter === 'all' ? '#FF6B35' : '#fff',
                            color: orderFilter === 'all' ? '#fff' : '#212121',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px'
                        }}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setOrderFilter('paid')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: orderFilter === 'paid' ? 'none' : '1px solid #E0E0E0',
                            backgroundColor: orderFilter === 'paid' ? '#FF6B35' : '#fff',
                            color: orderFilter === 'paid' ? '#fff' : '#212121',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        ✓ Pagados
                    </button>
                    <button
                        onClick={() => setOrderFilter('pending')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: orderFilter === 'pending' ? 'none' : '1px solid #E0E0E0',
                            backgroundColor: orderFilter === 'pending' ? '#FF6B35' : '#fff',
                            color: orderFilter === 'pending' ? '#fff' : '#212121',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        ⏱ Pendientes
                    </button>
                </div>

                {/* Orders List */}
                {getFilteredOrders().length > 0 ? (
                    getFilteredOrders().map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onClick={() => alert(`Ver orden ${order.id}`)}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#757575', padding: '32px' }}>
                        No hay pedidos {orderFilter === 'paid' ? 'pagados' : orderFilter === 'pending' ? 'pendientes' : ''}
                    </div>
                )}
            </div>
        </div>
    )
}

export default RestaurantDashboard
