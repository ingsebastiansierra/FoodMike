import React, { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

const RestaurantApproval = () => {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, pending, approved, rejected

    useEffect(() => {
        loadRestaurants()
    }, [filter])

    const loadRestaurants = async () => {
        setLoading(true)
        try {
            let query = supabase
                .from('restaurants')
                .select(`
                    *,
                    profiles!restaurants_owner_id_fkey (
                        full_name,
                        email
                    )
                `)
                .order('createdat', { ascending: false })

            if (filter !== 'all') {
                query = query.eq('status', filter)
            }

            const { data, error } = await query

            if (error) throw error
            setRestaurants(data || [])
        } catch (error) {
            console.error('Error cargando restaurantes:', error)
            alert('Error al cargar restaurantes')
        } finally {
            setLoading(false)
        }
    }

    const updateRestaurantStatus = async (restaurantId, newStatus, reason = '') => {
        try {
            const updates = {
                status: newStatus,
                updatedat: new Date().toISOString()
            }

            // Si se aprueba, abrir el restaurante
            if (newStatus === 'approved') {
                updates.isopen = true
            }

            const { error } = await supabase
                .from('restaurants')
                .update(updates)
                .eq('id', restaurantId)

            if (error) throw error

            // TODO: Enviar notificación al restaurante
            alert(`✅ Restaurante ${newStatus === 'approved' ? 'aprobado' : 'actualizado'} correctamente`)
            loadRestaurants()
        } catch (error) {
            console.error('Error actualizando estado:', error)
            alert('Error al actualizar el estado')
        }
    }

    const handleApprove = (restaurant) => {
        if (window.confirm(`¿Aprobar el restaurante "${restaurant.name}"?`)) {
            updateRestaurantStatus(restaurant.id, 'approved')
        }
    }

    const handleReject = (restaurant) => {
        const reason = prompt(`¿Por qué rechazas "${restaurant.name}"?`)
        if (reason) {
            updateRestaurantStatus(restaurant.id, 'rejected', reason)
        }
    }

    const handleReview = (restaurant) => {
        if (window.confirm(`¿Marcar "${restaurant.name}" como en revisión?`)) {
            updateRestaurantStatus(restaurant.id, 'in_review')
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: '#FFD93D',
            in_review: '#2196F3',
            approved: '#4CAF50',
            rejected: '#FF6B6B',
            active: '#4CAF50'
        }
        return colors[status] || '#9E9E9E'
    }

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pendiente',
            in_review: 'En Revisión',
            approved: 'Aprobado',
            rejected: 'Rechazado',
            active: 'Activo'
        }
        return texts[status] || status
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF6B35', marginBottom: '24px' }}>
                Gestión de Restaurantes
            </h1>

            {/* Filtros */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                    onClick={() => setFilter('all')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: filter === 'all' ? '#FF6B35' : '#fff',
                        color: filter === 'all' ? '#fff' : '#212121',
                        border: `2px solid ${filter === 'all' ? '#FF6B35' : '#E0E0E0'}`,
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Todos ({restaurants.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: filter === 'pending' ? '#FFD93D' : '#fff',
                        color: filter === 'pending' ? '#fff' : '#212121',
                        border: `2px solid ${filter === 'pending' ? '#FFD93D' : '#E0E0E0'}`,
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Pendientes
                </button>
                <button
                    onClick={() => setFilter('in_review')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: filter === 'in_review' ? '#2196F3' : '#fff',
                        color: filter === 'in_review' ? '#fff' : '#212121',
                        border: `2px solid ${filter === 'in_review' ? '#2196F3' : '#E0E0E0'}`,
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    En Revisión
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: filter === 'approved' ? '#4CAF50' : '#fff',
                        color: filter === 'approved' ? '#fff' : '#212121',
                        border: `2px solid ${filter === 'approved' ? '#4CAF50' : '#E0E0E0'}`,
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Aprobados
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: filter === 'rejected' ? '#FF6B6B' : '#fff',
                        color: filter === 'rejected' ? '#fff' : '#212121',
                        border: `2px solid ${filter === 'rejected' ? '#FF6B6B' : '#E0E0E0'}`,
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Rechazados
                </button>
            </div>

            {/* Lista de Restaurantes */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                    <div>Cargando restaurantes...</div>
                </div>
            ) : restaurants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#757575' }}>
                    No hay restaurantes {filter !== 'all' ? `con estado "${getStatusText(filter)}"` : ''}
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: `2px solid ${getStatusColor(restaurant.status)}20`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                                            {restaurant.name}
                                        </h3>
                                        <span style={{
                                            padding: '4px 12px',
                                            backgroundColor: getStatusColor(restaurant.status),
                                            color: '#fff',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {getStatusText(restaurant.status)}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#757575', margin: '4px 0' }}>
                                        📧 {restaurant.profiles?.email || 'Sin email'}
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#757575', margin: '4px 0' }}>
                                        👤 {restaurant.profiles?.full_name || 'Sin nombre'}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <p style={{ fontSize: '13px', color: '#757575', marginBottom: '4px' }}>📍 Dirección:</p>
                                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{restaurant.address}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '13px', color: '#757575', marginBottom: '4px' }}>📞 Teléfono:</p>
                                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{restaurant.phone}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '13px', color: '#757575', marginBottom: '4px' }}>🍽️ Tipo de Cocina:</p>
                                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{restaurant.cuisine_type}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '13px', color: '#757575', marginBottom: '4px' }}>⭐ Especialidades:</p>
                                    <p style={{ fontSize: '14px', fontWeight: '500' }}>
                                        {restaurant.specialties?.join(', ') || 'Sin especialidades'}
                                    </p>
                                </div>
                            </div>

                            {restaurant.description && (
                                <div style={{ marginBottom: '16px' }}>
                                    <p style={{ fontSize: '13px', color: '#757575', marginBottom: '4px' }}>📝 Descripción:</p>
                                    <p style={{ fontSize: '14px' }}>{restaurant.description}</p>
                                </div>
                            )}

                            {/* Acciones */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E0E0E0' }}>
                                {restaurant.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(restaurant)}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                backgroundColor: '#4CAF50',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✓ Aprobar
                                        </button>
                                        <button
                                            onClick={() => handleReview(restaurant)}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                backgroundColor: '#2196F3',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            👁️ Revisar
                                        </button>
                                        <button
                                            onClick={() => handleReject(restaurant)}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                backgroundColor: '#FF6B6B',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✗ Rechazar
                                        </button>
                                    </>
                                )}
                                {restaurant.status === 'in_review' && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(restaurant)}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                backgroundColor: '#4CAF50',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✓ Aprobar
                                        </button>
                                        <button
                                            onClick={() => handleReject(restaurant)}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                backgroundColor: '#FF6B6B',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✗ Rechazar
                                        </button>
                                    </>
                                )}
                                {restaurant.status === 'rejected' && (
                                    <button
                                        onClick={() => handleReview(restaurant)}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#2196F3',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🔄 Revisar de Nuevo
                                    </button>
                                )}
                                {restaurant.coordinates && (
                                    <a
                                        href={`https://www.google.com/maps?q=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: '12px 20px',
                                            backgroundColor: '#E0E0E0',
                                            color: '#212121',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        🗺️ Ver Mapa
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default RestaurantApproval
