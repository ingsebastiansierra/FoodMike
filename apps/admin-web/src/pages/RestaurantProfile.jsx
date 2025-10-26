import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabase'

// Especialidades disponibles con iconos
const AVAILABLE_SPECIALTIES = [
    { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'pollo', name: 'Pollo', icon: '🍗' },
    { id: 'parrilla', name: 'Parrilla', icon: '🥩' },
    { id: 'comida-rapida', name: 'Comida Rápida', icon: '🍟' },
    { id: 'perros-calientes', name: 'Perros Calientes', icon: '🌭' },
    { id: 'tacos', name: 'Tacos', icon: '🌮' },
    { id: 'sushi', name: 'Sushi', icon: '🍱' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
    { id: 'sopas', name: 'Sopas', icon: '🍲' },
    { id: 'ensaladas', name: 'Ensaladas', icon: '🥗' },
    { id: 'postres', name: 'Postres', icon: '🍰' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
    { id: 'cafe', name: 'Café', icon: '☕' },
    { id: 'desayunos', name: 'Desayunos', icon: '🍳' },
    { id: 'almuerzos', name: 'Almuerzos', icon: '🍽️' },
    { id: 'comida-colombiana', name: 'Comida Colombiana', icon: '🇨🇴' },
    { id: 'arepas', name: 'Arepas', icon: '🫓' },
    { id: 'empanadas', name: 'Empanadas', icon: '🥟' },
    { id: 'sanduches', name: 'Sánduches', icon: '🥪' },
]

const RestaurantProfile = () => {
    const { user, profile } = useAuth()
    const [restaurant, setRestaurant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({})
    const [currentTab, setCurrentTab] = useState('basic') // basic, location, config, schedule

    useEffect(() => {
        loadRestaurant()
    }, [profile])

    const loadRestaurant = async () => {
        try {
            // Primero intentar cargar la solicitud pendiente/rechazada
            const { data: application, error: appError } = await supabase
                .from('restaurant_applications')
                .select('*')
                .eq('owner_id', user.id)
                .in('status', ['pending', 'rejected', 'in_review'])
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (appError && appError.code !== 'PGRST116') throw appError

            // Si hay una solicitud pendiente, cargarla
            if (application) {
                setRestaurant(application)
                setFormData({
                    // Básico
                    name: application.name || '',
                    description: application.description || '',
                    phone: application.phone || '',
                    email: application.email || '',
                    // Ubicación
                    address: application.address || '',
                    location: application.location || 'Samacá, Boyacá',
                    coordinates: application.coordinates || { lat: '', lng: '' },
                    // Configuración
                    cuisine_type: application.cuisine_type || '',
                    specialties: (application.specialties || []).map(name => {
                        const specialty = AVAILABLE_SPECIALTIES.find(s => s.name === name)
                        return specialty ? specialty.id : name
                    }),
                    delivery_fee: application.deliveryfee || 5000,
                    min_order: application.minorder || 15000,
                    delivery_time: application.delivery_time || '30-45 min',
                    // Horarios
                    schedule: application.schedule || {
                        monday: { open: '08:00', close: '20:00', closed: false },
                        tuesday: { open: '08:00', close: '20:00', closed: false },
                        wednesday: { open: '08:00', close: '20:00', closed: false },
                        thursday: { open: '08:00', close: '20:00', closed: false },
                        friday: { open: '08:00', close: '20:00', closed: false },
                        saturday: { open: '08:00', close: '20:00', closed: false },
                        sunday: { open: '08:00', close: '20:00', closed: true },
                    },
                })
                setLoading(false)
                return
            }

            // Si no hay solicitud pendiente, cargar el restaurante aprobado
            if (!profile?.restaurant_id) {
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('restaurants')
                .select('*')
                .eq('id', profile.restaurant_id)
                .single()

            if (error) throw error

            setRestaurant(data)
            setFormData({
                // Básico
                name: data.name || '',
                description: data.description || '',
                phone: data.phone || '',
                email: data.email || '',
                // Ubicación
                address: data.address || '',
                location: data.location || 'Samacá, Boyacá',
                coordinates: data.coordinates || { lat: '', lng: '' },
                // Configuración
                cuisine_type: data.cuisine_type || '',
                specialties: (data.specialties || []).map(name => {
                    // Convertir nombres a IDs para el selector
                    const specialty = AVAILABLE_SPECIALTIES.find(s => s.name === name)
                    return specialty ? specialty.id : name
                }),
                delivery_fee: data.deliveryfee || 5000,
                min_order: data.minorder || 15000,
                delivery_time: data.delivery_time || '30-45 min',
                // Horarios
                schedule: data.schedule || {
                    monday: { open: '08:00', close: '20:00', closed: false },
                    tuesday: { open: '08:00', close: '20:00', closed: false },
                    wednesday: { open: '08:00', close: '20:00', closed: false },
                    thursday: { open: '08:00', close: '20:00', closed: false },
                    friday: { open: '08:00', close: '20:00', closed: false },
                    saturday: { open: '08:00', close: '20:00', closed: false },
                    sunday: { open: '08:00', close: '20:00', closed: true },
                },
            })
        } catch (error) {
            console.error('Error cargando restaurante:', error)
        } finally {
            setLoading(false)
        }
    }

    // Funciones para manejo de ubicación GPS
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización')
            return
        }

        setLoading(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    coordinates: {
                        lat: position.coords.latitude.toFixed(6),
                        lng: position.coords.longitude.toFixed(6)
                    }
                }))
                setLoading(false)
                alert('✅ Ubicación obtenida correctamente')
            },
            (error) => {
                setLoading(false)
                let errorMessage = 'No se pudo obtener la ubicación'
                if (error.code === 1) {
                    errorMessage = 'Debes permitir el acceso a tu ubicación'
                } else if (error.code === 2) {
                    errorMessage = 'No se pudo determinar tu ubicación'
                } else if (error.code === 3) {
                    errorMessage = 'Tiempo de espera agotado'
                }
                alert('❌ ' + errorMessage)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        )
    }

    const handleSearchInMap = () => {
        const searchQuery = formData.address || formData.name || 'Samacá, Boyacá'
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@5.5,-73.5,13z`
        window.open(mapsUrl, '_blank', 'width=800,height=600')
        alert(
            '📍 Instrucciones:\n\n' +
            '1. Busca tu negocio en el mapa\n' +
            '2. Haz clic derecho en la ubicación exacta\n' +
            '3. Copia las coordenadas (aparecen arriba)\n' +
            '4. Pega aquí en el campo de Latitud\n' +
            '5. Haz clic en "Obtener Dirección"\n\n' +
            'Formato: 5.123456, -73.123456'
        )
    }

    const handleCoordinatesPaste = async (value) => {
        if (value.includes(',')) {
            const parts = value.split(',').map(p => p.trim())
            if (parts.length === 2) {
                const lat = parts[0]
                const lng = parts[1]
                setFormData(prev => ({
                    ...prev,
                    coordinates: { lat, lng }
                }))
                setTimeout(() => getAddressFromCoordinates(lat, lng), 500)
                return
            }
        }
    }

    const getAddressFromCoordinates = async (lat, lng) => {
        const latValue = lat || formData.coordinates.lat
        const lngValue = lng || formData.coordinates.lng

        if (!latValue || !lngValue) {
            alert('Por favor ingresa las coordenadas primero')
            return
        }

        setLoading(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latValue}&lon=${lngValue}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'es'
                    }
                }
            )

            const data = await response.json()

            if (data && data.display_name) {
                const address = data.address
                let formattedAddress = ''

                if (address.road) {
                    formattedAddress = address.road
                    if (address.house_number) {
                        formattedAddress += ' #' + address.house_number
                    }
                } else if (address.neighbourhood) {
                    formattedAddress = address.neighbourhood
                }

                let location = ''
                if (address.city || address.town || address.village) {
                    location = address.city || address.town || address.village
                    if (address.state) {
                        location += ', ' + address.state
                    }
                }

                setFormData(prev => ({
                    ...prev,
                    address: formattedAddress || data.display_name,
                    location: location || prev.location
                }))

                alert('✅ Dirección obtenida correctamente')
            } else {
                alert('❌ No se pudo obtener la dirección')
            }
        } catch (error) {
            console.error('Error obteniendo dirección:', error)
            alert('❌ Error al obtener la dirección')
        } finally {
            setLoading(false)
        }
    }

    const toggleSpecialty = (specialtyId) => {
        const currentSpecialties = formData.specialties || []
        setFormData({
            ...formData,
            specialties: currentSpecialties.includes(specialtyId)
                ? currentSpecialties.filter(id => id !== specialtyId)
                : [...currentSpecialties, specialtyId]
        })
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // Preparar coordenadas
            let coordinates = null
            if (formData.coordinates?.lat && formData.coordinates?.lng) {
                const lat = parseFloat(formData.coordinates.lat)
                const lng = parseFloat(formData.coordinates.lng)
                if (!isNaN(lat) && !isNaN(lng)) {
                    coordinates = { lat, lng }
                }
            }

            // Preparar datos para actualizar
            const updateData = {
                // Básico
                name: formData.name,
                description: formData.description,
                phone: formData.phone,
                email: formData.email,
                // Ubicación
                address: formData.address,
                location: formData.location,
                coordinates: coordinates,
                // Configuración
                cuisine_type: formData.cuisine_type,
                specialties: formData.specialties?.map(id => {
                    // Si es un ID de la lista, convertir a nombre
                    const specialty = AVAILABLE_SPECIALTIES.find(s => s.id === id)
                    return specialty ? specialty.name : id
                }) || [],
                deliveryfee: parseFloat(formData.delivery_fee) || 0,
                minorder: parseFloat(formData.min_order) || 0,
                delivery_time: formData.delivery_time,
                // Horarios
                schedule: formData.schedule,
            }

            // Determinar si es una solicitud o un restaurante aprobado
            const isApplication = restaurant.status && ['pending', 'rejected', 'in_review'].includes(restaurant.status)

            if (isApplication) {
                // Actualizar la solicitud
                updateData.status = restaurant.status === 'rejected' ? 'pending' : restaurant.status

                const { data, error } = await supabase
                    .from('restaurant_applications')
                    .update(updateData)
                    .eq('id', restaurant.id)
                    .select()

                if (error) throw error

                alert('✅ Solicitud actualizada correctamente. Será revisada nuevamente por nuestro equipo.')
            } else {
                // Actualizar el restaurante aprobado
                const { data, error } = await supabase
                    .from('restaurants')
                    .update(updateData)
                    .eq('id', profile.restaurant_id)
                    .select()

                if (error) throw error

                alert('✅ Cambios guardados correctamente')
            }

            setEditMode(false)
            loadRestaurant()
        } catch (error) {
            console.error('Error guardando:', error)
            alert(`❌ Error al guardar: ${error.message || 'Error desconocido'}`)
        } finally {
            setSaving(false)
        }
    }

    const getStatusInfo = (status) => {
        const info = {
            pending: {
                color: '#FFD93D',
                icon: '⏳',
                text: 'Pendiente de Aprobación',
                message: 'Tu solicitud está en cola para ser revisada por nuestro equipo.'
            },
            in_review: {
                color: '#2196F3',
                icon: '👁️',
                text: 'En Revisión',
                message: 'Nuestro equipo está revisando tu información. Te notificaremos pronto.'
            },
            approved: {
                color: '#4CAF50',
                icon: '✅',
                text: 'Aprobado',
                message: '¡Felicitaciones! Tu restaurante ha sido aprobado y está activo.'
            },
            rejected: {
                color: '#FF6B6B',
                icon: '❌',
                text: 'Rechazado',
                message: 'Tu solicitud fue rechazada. Por favor revisa y corrige la información.'
            }
        }
        return info[status] || info.pending
    }

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
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                    <div style={{ fontSize: '18px', color: '#757575' }}>Cargando...</div>
                </div>
            </div>
        )
    }

    if (!restaurant) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                    <div style={{ fontSize: '18px', color: '#757575' }}>No se encontró información del restaurante</div>
                </div>
            </div>
        )
    }

    const statusInfo = getStatusInfo(restaurant.status)
    const isApproved = restaurant.status === 'approved'

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header con Estado */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>{statusInfo.icon}</div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: statusInfo.color,
                        marginBottom: '8px'
                    }}>
                        {statusInfo.text}
                    </h1>
                    <p style={{ fontSize: '16px', color: '#757575', marginBottom: '16px' }}>
                        {statusInfo.message}
                    </p>
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 24px',
                        backgroundColor: `${statusInfo.color}20`,
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: statusInfo.color
                    }}>
                        Estado: {statusInfo.text}
                    </div>
                </div>

                {/* Información del Perfil */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Tu Perfil
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#757575', marginBottom: '4px' }}>Nombre:</p>
                            <p style={{ fontSize: '16px', fontWeight: '500' }}>{profile?.full_name || 'Sin nombre'}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', color: '#757575', marginBottom: '4px' }}>Correo:</p>
                            <p style={{ fontSize: '16px', fontWeight: '500' }}>{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Información del Restaurante - Editable */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                            Información del Restaurante
                        </h2>
                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#FF6B35',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                ✏️ Editar
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => {
                                        setEditMode(false)
                                        loadRestaurant()
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#E0E0E0',
                                        color: '#212121',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: saving ? '#BDBDBD' : '#4CAF50',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: saving ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {saving ? 'Guardando...' : '💾 Guardar'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pestañas */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '24px',
                        borderBottom: '2px solid #E0E0E0',
                        paddingBottom: '0'
                    }}>
                        {[
                            { id: 'basic', label: '📋 Básico', icon: '📋' },
                            { id: 'location', label: '📍 Ubicación', icon: '📍' },
                            { id: 'config', label: '⚙️ Configuración', icon: '⚙️' },
                            { id: 'schedule', label: '🕐 Horarios', icon: '🕐' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setCurrentTab(tab.id)}
                                style={{
                                    padding: '12px 20px',
                                    border: 'none',
                                    background: 'none',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: currentTab === tab.id ? '#FF6B35' : '#757575',
                                    borderBottom: currentTab === tab.id ? '3px solid #FF6B35' : 'none',
                                    cursor: 'pointer',
                                    marginBottom: '-2px'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Contenido según pestaña */}
                    {currentTab === 'basic' && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Nombre del Restaurante *
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej: Restaurante El Sabor"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E0E0E0',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                        {restaurant.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Descripción
                                </label>
                                {editMode ? (
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe tu restaurante..."
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E0E0E0',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            resize: 'vertical'
                                        }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                        {restaurant.description || 'Sin descripción'}
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                        Teléfono *
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="3001234567"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #E0E0E0',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                            {restaurant.phone}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                        Email
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="contacto@restaurante.com"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #E0E0E0',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                            {restaurant.email || 'Sin email'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pestaña Ubicación */}
                    {currentTab === 'location' && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {/* Botones de acción GPS */}
                            {editMode && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <button
                                        onClick={handleGetLocation}
                                        disabled={loading}
                                        style={{
                                            padding: '14px',
                                            backgroundColor: loading ? '#BDBDBD' : '#4CAF50',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        📍 {loading ? 'Obteniendo...' : 'Usar mi Ubicación GPS'}
                                    </button>
                                    <button
                                        onClick={handleSearchInMap}
                                        style={{
                                            padding: '14px',
                                            backgroundColor: '#2196F3',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        🗺️ Buscar en Mapa
                                    </button>
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                    Dirección Completa *
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Ej: Calle 10 #5-20"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E0E0E0',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                        {restaurant.address}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                    Ciudad/Municipio *
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="Ej: Samacá, Boyacá"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E0E0E0',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                        {restaurant.location}
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                        Latitud
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={formData.coordinates?.lat || ''}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                setFormData({
                                                    ...formData,
                                                    coordinates: { ...formData.coordinates, lat: value }
                                                })
                                                handleCoordinatesPaste(value)
                                            }}
                                            onPaste={(e) => {
                                                const pastedText = e.clipboardData.getData('text')
                                                handleCoordinatesPaste(pastedText)
                                            }}
                                            placeholder="Ej: 5.4567 o pega ambas coordenadas"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #E0E0E0',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                            {restaurant.coordinates?.lat || 'No especificado'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                        Longitud
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={formData.coordinates?.lng || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                coordinates: { ...formData.coordinates, lng: e.target.value }
                                            })}
                                            placeholder="Ej: -73.1234"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #E0E0E0',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                            {restaurant.coordinates?.lng || 'No especificado'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {editMode && formData.coordinates?.lat && formData.coordinates?.lng && (
                                <button
                                    onClick={() => getAddressFromCoordinates()}
                                    disabled={loading}
                                    style={{
                                        padding: '12px',
                                        backgroundColor: loading ? '#BDBDBD' : '#FF6B35',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? '⏳ Obteniendo dirección...' : '🔍 Obtener Dirección desde Coordenadas'}
                                </button>
                            )}

                            {editMode && (
                                <div style={{
                                    padding: '16px',
                                    backgroundColor: '#E3F2FD',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#1565C0',
                                    lineHeight: '1.6'
                                }}>
                                    <strong>💡 Opciones para obtener tu ubicación:</strong>
                                    <ul style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px' }}>
                                        <li><strong>GPS Automático:</strong> Haz clic en "Usar mi Ubicación GPS"</li>
                                        <li><strong>Buscar en Mapa:</strong> Encuentra tu negocio en Google Maps y copia las coordenadas</li>
                                        <li><strong>Pegar Coordenadas:</strong> Pega ambas coordenadas juntas (5.123, -73.456) en el campo de Latitud</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pestaña Configuración */}
                    {currentTab === 'config' && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Tipo de Cocina *
                                </label>
                                {editMode ? (
                                    <select
                                        value={formData.cuisine_type}
                                        onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E0E0E0',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">Selecciona...</option>
                                        <option value="Comida Rápida">Comida Rápida</option>
                                        <option value="Colombiana">Colombiana</option>
                                        <option value="Italiana">Italiana</option>
                                        <option value="Mexicana">Mexicana</option>
                                        <option value="China">China</option>
                                        <option value="Japonesa">Japonesa</option>
                                        <option value="Parrilla">Parrilla</option>
                                        <option value="Vegetariana">Vegetariana</option>
                                        <option value="Postres">Postres</option>
                                        <option value="Bebidas">Bebidas</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                ) : (
                                    <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                        {restaurant.cuisine_type}
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                        Costo de Domicilio (COP)
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            value={formData.delivery_fee}
                                            onChange={(e) => setFormData({ ...formData, delivery_fee: e.target.value })}
                                            placeholder="5000"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #E0E0E0',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                            ${restaurant.deliveryfee?.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                        Pedido Mínimo (COP)
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            value={formData.min_order}
                                            onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                                            placeholder="15000"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #E0E0E0',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                            ${restaurant.minorder?.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                                        Tiempo de Entrega
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={formData.delivery_time}
                                            onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                                            placeholder="30-45 min"
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #E0E0E0',
                                                borderRadius: '8px',
                                                fontSize: '14px'
                                            }}
                                        />
                                    ) : (
                                        <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                            {restaurant.delivery_time}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                                    Especialidades {editMode ? '(Selecciona las que ofreces)' : ''}
                                </label>
                                {editMode ? (
                                    <div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                            gap: '12px',
                                            marginBottom: '16px'
                                        }}>
                                            {AVAILABLE_SPECIALTIES.map((specialty) => {
                                                const isSelected = formData.specialties?.includes(specialty.id)
                                                return (
                                                    <button
                                                        key={specialty.id}
                                                        type="button"
                                                        onClick={() => toggleSpecialty(specialty.id)}
                                                        style={{
                                                            padding: '12px',
                                                            border: `2px solid ${isSelected ? '#FF6B35' : '#E0E0E0'}`,
                                                            borderRadius: '12px',
                                                            backgroundColor: isSelected ? '#FFE0D6' : '#fff',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            position: 'relative'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!isSelected) {
                                                                e.currentTarget.style.borderColor = '#FF6B35'
                                                                e.currentTarget.style.backgroundColor = '#FFF5F2'
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!isSelected) {
                                                                e.currentTarget.style.borderColor = '#E0E0E0'
                                                                e.currentTarget.style.backgroundColor = '#fff'
                                                            }
                                                        }}
                                                    >
                                                        {isSelected && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '4px',
                                                                right: '4px',
                                                                backgroundColor: '#4CAF50',
                                                                borderRadius: '50%',
                                                                width: '20px',
                                                                height: '20px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '12px',
                                                                color: '#fff'
                                                            }}>
                                                                ✓
                                                            </div>
                                                        )}
                                                        <div style={{ fontSize: '32px' }}>{specialty.icon}</div>
                                                        <div style={{
                                                            fontSize: '13px',
                                                            fontWeight: isSelected ? '600' : '500',
                                                            color: isSelected ? '#FF6B35' : '#212121',
                                                            textAlign: 'center'
                                                        }}>
                                                            {specialty.name}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {formData.specialties?.length > 0 && (
                                            <div style={{
                                                padding: '12px',
                                                backgroundColor: '#E8F5E9',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                color: '#2E7D32'
                                            }}>
                                                ✓ {formData.specialties.length} especialidad{formData.specialties.length !== 1 ? 'es' : ''} seleccionada{formData.specialties.length !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {restaurant.specialties?.length > 0 ? (
                                            restaurant.specialties.map((specId, idx) => {
                                                const specialty = AVAILABLE_SPECIALTIES.find(s => s.id === specId)
                                                return specialty ? (
                                                    <div key={idx} style={{
                                                        padding: '10px 16px',
                                                        backgroundColor: '#FFE0D6',
                                                        border: '2px solid #FF6B35',
                                                        borderRadius: '12px',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        color: '#FF6B35',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}>
                                                        <span style={{ fontSize: '20px' }}>{specialty.icon}</span>
                                                        <span>{specialty.name}</span>
                                                    </div>
                                                ) : (
                                                    <span key={idx} style={{
                                                        padding: '8px 14px',
                                                        backgroundColor: '#E0E0E0',
                                                        borderRadius: '12px',
                                                        fontSize: '13px',
                                                        fontWeight: '500',
                                                        color: '#616161'
                                                    }}>
                                                        {specId}
                                                    </span>
                                                )
                                            })
                                        ) : (
                                            <p style={{ fontSize: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', width: '100%' }}>
                                                Sin especialidades
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Pestaña Horarios */}
                    {currentTab === 'schedule' && (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                                const dayNames = {
                                    monday: 'Lunes',
                                    tuesday: 'Martes',
                                    wednesday: 'Miércoles',
                                    thursday: 'Jueves',
                                    friday: 'Viernes',
                                    saturday: 'Sábado',
                                    sunday: 'Domingo'
                                }
                                const daySchedule = formData.schedule?.[day] || { open: '08:00', close: '20:00', closed: false }

                                return (
                                    <div key={day} style={{
                                        padding: '16px',
                                        border: '2px solid #E0E0E0',
                                        borderRadius: '8px',
                                        backgroundColor: daySchedule.closed ? '#f5f5f5' : '#fff'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '15px', fontWeight: '600' }}>
                                                {dayNames[day]}
                                            </span>
                                            {editMode && (
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={daySchedule.closed}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            schedule: {
                                                                ...formData.schedule,
                                                                [day]: { ...daySchedule, closed: e.target.checked }
                                                            }
                                                        })}
                                                        style={{ width: '18px', height: '18px' }}
                                                    />
                                                    <span style={{ fontSize: '13px', color: '#757575' }}>Cerrado</span>
                                                </label>
                                            )}
                                        </div>

                                        {!daySchedule.closed && (
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', color: '#757575', marginBottom: '4px' }}>
                                                        Apertura
                                                    </label>
                                                    {editMode ? (
                                                        <input
                                                            type="time"
                                                            value={daySchedule.open}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                schedule: {
                                                                    ...formData.schedule,
                                                                    [day]: { ...daySchedule, open: e.target.value }
                                                                }
                                                            })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #E0E0E0',
                                                                borderRadius: '6px',
                                                                fontSize: '14px'
                                                            }}
                                                        />
                                                    ) : (
                                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>
                                                            {daySchedule.open}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', color: '#757575', marginBottom: '4px' }}>
                                                        Cierre
                                                    </label>
                                                    {editMode ? (
                                                        <input
                                                            type="time"
                                                            value={daySchedule.close}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                schedule: {
                                                                    ...formData.schedule,
                                                                    [day]: { ...daySchedule, close: e.target.value }
                                                                }
                                                            })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                border: '1px solid #E0E0E0',
                                                                borderRadius: '6px',
                                                                fontSize: '14px'
                                                            }}
                                                        />
                                                    ) : (
                                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>
                                                            {daySchedule.close}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {!editMode && daySchedule.closed && (
                                            <p style={{ fontSize: '14px', color: '#757575', fontStyle: 'italic' }}>
                                                Cerrado
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantProfile
