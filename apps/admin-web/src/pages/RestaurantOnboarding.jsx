import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabase'
import { useNavigate } from 'react-router-dom'

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

const RestaurantOnboarding = () => {
    const { user, profile, logout } = useAuth()
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showExitWarning, setShowExitWarning] = useState(false)

    // Prevenir navegación hacia atrás
    React.useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault()
            e.returnValue = '¿Estás seguro de que quieres salir? Perderás tu progreso.'
        }

        const handlePopState = (e) => {
            e.preventDefault()
            setShowExitWarning(true)
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        window.addEventListener('popstate', handlePopState)

        // Prevenir el botón de atrás
        window.history.pushState(null, '', window.location.pathname)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    // Recuperar datos guardados del localStorage
    const getSavedData = () => {
        try {
            const saved = localStorage.getItem('onboarding_draft')
            if (saved) {
                return JSON.parse(saved)
            }
        } catch (error) {
            console.error('Error recuperando datos:', error)
        }
        return null
    }

    // Datos del formulario
    const [formData, setFormData] = useState(() => {
        const savedData = getSavedData()
        return savedData || {
            // Paso 1: Información básica
            name: '',
            description: '',
            phone: '',
            email: user?.email || '',

            // Paso 2: Ubicación
            address: '',
            location: 'Samacá, Boyacá',
            coordinates: { lat: '', lng: '' },

            // Paso 3: Configuración de negocio
            cuisine_type: '',
            specialties: [],
            delivery_fee: '5000',
            min_order: '15000',
            delivery_time: '30-45 min',

            // Paso 4: Horarios
            schedule: {
                monday: { open: '08:00', close: '20:00', closed: false },
                tuesday: { open: '08:00', close: '20:00', closed: false },
                wednesday: { open: '08:00', close: '20:00', closed: false },
                thursday: { open: '08:00', close: '20:00', closed: false },
                friday: { open: '08:00', close: '20:00', closed: false },
                saturday: { open: '08:00', close: '20:00', closed: false },
                sunday: { open: '08:00', close: '20:00', closed: true },
            },

            // Paso 5: Imágenes (opcional por ahora)
            image: '',
            coverimage: '',
        }
    })

    // Guardar en localStorage cada vez que cambie formData
    React.useEffect(() => {
        localStorage.setItem('onboarding_draft', JSON.stringify(formData))
    }, [formData])

    // Mostrar mensaje si hay datos guardados
    React.useEffect(() => {
        const savedData = getSavedData()
        if (savedData && savedData.name) {
            console.log('✅ Datos recuperados del borrador')
        }
    }, [])

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const toggleSpecialty = (specialtyId) => {
        setFormData(prev => {
            const currentSpecialties = prev.specialties || []
            const isSelected = currentSpecialties.includes(specialtyId)

            return {
                ...prev,
                specialties: isSelected
                    ? currentSpecialties.filter(id => id !== specialtyId)
                    : [...currentSpecialties, specialtyId]
            }
        })
    }

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
        // Construir URL de búsqueda en Google Maps
        const searchQuery = formData.address || formData.name || 'Samacá, Boyacá'
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@5.5,-73.5,13z`

        // Abrir en nueva ventana
        window.open(mapsUrl, '_blank', 'width=800,height=600')

        // Mostrar instrucciones
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
        // Detectar si pegó ambas coordenadas juntas (formato: "5.123456, -73.123456")
        if (value.includes(',')) {
            const parts = value.split(',').map(p => p.trim())
            if (parts.length === 2) {
                const lat = parts[0]
                const lng = parts[1]

                setFormData(prev => ({
                    ...prev,
                    coordinates: { lat, lng }
                }))

                // Obtener dirección automáticamente
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
            // Usar la API de Nominatim (OpenStreetMap) - gratuita y sin API key
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
                // Construir dirección legible
                const address = data.address
                let formattedAddress = ''

                if (address.road) {
                    formattedAddress = address.road
                    if (address.house_number) {
                        formattedAddress += ' #' + address.house_number
                    }
                } else if (address.neighbourhood) {
                    formattedAddress = address.neighbourhood
                } else {
                    formattedAddress = data.display_name.split(',')[0]
                }

                if (address.suburb || address.neighbourhood) {
                    formattedAddress += ', ' + (address.suburb || address.neighbourhood)
                }

                setFormData(prev => ({
                    ...prev,
                    address: formattedAddress
                }))

                alert('✅ Dirección obtenida: ' + formattedAddress)
            } else {
                alert('⚠️ No se pudo obtener la dirección. Ingrésala manualmente.')
            }
        } catch (error) {
            console.error('Error obteniendo dirección:', error)
            alert('⚠️ Error al obtener la dirección. Ingrésala manualmente.')
        } finally {
            setLoading(false)
        }
    }

    const handleScheduleChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    [field]: value
                }
            }
        }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            // 1. Crear la solicitud de restaurante (no el restaurante directamente)
            const { data: application, error: applicationError } = await supabase
                .from('restaurant_applications')
                .insert([
                    {
                        owner_id: user.id,
                        name: formData.name,
                        description: formData.description,
                        phone: formData.phone,
                        email: formData.email,
                        address: formData.address,
                        location: formData.location,
                        coordinates: formData.coordinates.lat && formData.coordinates.lng
                            ? { lat: parseFloat(formData.coordinates.lat), lng: parseFloat(formData.coordinates.lng) }
                            : null,
                        cuisine_type: formData.cuisine_type,
                        specialties: formData.specialties.map(id => {
                            // Si es un ID de la lista, convertir a nombre
                            const specialty = AVAILABLE_SPECIALTIES.find(s => s.id === id)
                            return specialty ? specialty.name : id
                        }),
                        deliveryfee: parseFloat(formData.delivery_fee),
                        minorder: parseFloat(formData.min_order),
                        delivery_time: formData.delivery_time,
                        schedule: formData.schedule,
                        image: formData.image || null,
                        coverimage: formData.coverimage || null,
                        status: 'pending', // Pendiente de aprobación
                    }
                ])
                .select()
                .single()

            if (applicationError) throw applicationError

            // 2. Actualizar el perfil del usuario para cambiar rol (pero sin restaurant_id aún)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    role: 'administradorRestaurante'
                })
                .eq('id', user.id)

            if (profileError) throw profileError

            // Limpiar el borrador guardado
            localStorage.removeItem('onboarding_draft')

            alert(
                '✅ ¡Solicitud enviada exitosamente!\n\n' +
                'Tu solicitud está siendo revisada por nuestro equipo.\n' +
                'Te notificaremos cuando sea aprobada.\n\n' +
                'Mientras tanto, puedes editar tu información en tu perfil.'
            )

            // Recargar la página para actualizar el contexto de autenticación
            window.location.href = '/restaurant'

        } catch (err) {
            console.error('Error:', err)
            setError(err.message || 'Error al registrar el restaurante')
        } finally {
            setLoading(false)
        }
    }

    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (!formData.name || formData.name.trim().length < 3) {
                    return 'El nombre del restaurante debe tener al menos 3 caracteres'
                }
                if (!formData.phone || formData.phone.trim().length < 10) {
                    return 'El teléfono debe tener al menos 10 dígitos'
                }
                if (!/^\d+$/.test(formData.phone.trim())) {
                    return 'El teléfono solo debe contener números'
                }
                if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    return 'El email no tiene un formato válido'
                }
                break

            case 2:
                if (!formData.address || formData.address.trim().length < 10) {
                    return 'La dirección debe tener al menos 10 caracteres'
                }
                if (formData.coordinates.lat && isNaN(parseFloat(formData.coordinates.lat))) {
                    return 'La latitud debe ser un número válido'
                }
                if (formData.coordinates.lng && isNaN(parseFloat(formData.coordinates.lng))) {
                    return 'La longitud debe ser un número válido'
                }
                break

            case 3:
                if (!formData.cuisine_type) {
                    return 'Por favor selecciona el tipo de cocina'
                }
                if (isNaN(parseFloat(formData.delivery_fee)) || parseFloat(formData.delivery_fee) < 0) {
                    return 'El costo de domicilio debe ser un número válido'
                }
                if (isNaN(parseFloat(formData.min_order)) || parseFloat(formData.min_order) < 0) {
                    return 'El pedido mínimo debe ser un número válido'
                }
                if (!formData.delivery_time || formData.delivery_time.trim().length < 3) {
                    return 'Por favor ingresa el tiempo de entrega'
                }
                break

            case 4:
                // Validar que al menos un día esté abierto
                const hasOpenDay = Object.values(formData.schedule).some(day => !day.closed)
                if (!hasOpenDay) {
                    return 'Debes tener al menos un día abierto'
                }
                // Validar horarios
                for (const [day, hours] of Object.entries(formData.schedule)) {
                    if (!hours.closed) {
                        if (!hours.open || !hours.close) {
                            return `Por favor completa los horarios de ${day}`
                        }
                        if (hours.open >= hours.close) {
                            return `La hora de cierre debe ser después de la hora de apertura (${day})`
                        }
                    }
                }
                break

            default:
                return null
        }
        return null
    }

    const nextStep = () => {
        const validationError = validateStep(currentStep)
        if (validationError) {
            setError(validationError)
            return
        }

        setError('')
        setCurrentStep(prev => prev + 1)
    }

    const prevStep = () => {
        setError('')
        setCurrentStep(prev => prev - 1)
    }

    const handleExit = async () => {
        if (window.confirm('¿Estás seguro de que quieres salir? Perderás todo tu progreso y no podrás acceder al sistema hasta completar el registro.')) {
            await logout()
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            position: 'relative'
        }}>
            {/* Exit Warning Modal */}
            {showExitWarning && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '400px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                            ¿Salir del registro?
                        </h2>
                        <p style={{ fontSize: '14px', color: '#757575', marginBottom: '24px' }}>
                            Si sales ahora, perderás todo tu progreso y no podrás acceder al sistema hasta completar el registro.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowExitWarning(false)}
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
                                Continuar Registro
                            </button>
                            <button
                                onClick={handleExit}
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
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF6B35', margin: 0 }}>
                            Registra tu Restaurante
                        </h1>
                        <p style={{ fontSize: '14px', color: '#757575', marginTop: '8px' }}>
                            Completa la información para empezar a vender
                        </p>
                    </div>
                    <button
                        onClick={() => setShowExitWarning(true)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#FF6B6B',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Salir
                    </button>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                    }}>
                        {[1, 2, 3, 4, 5].map(step => (
                            <div
                                key={step}
                                style={{
                                    width: '18%',
                                    height: '4px',
                                    backgroundColor: step <= currentStep ? '#FF6B35' : '#E0E0E0',
                                    borderRadius: '2px',
                                    transition: 'background-color 0.3s'
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '14px', color: '#757575' }}>
                        Paso {currentStep} de 5
                    </div>
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

                {/* Step 1: Información Básica */}
                {currentStep === 1 && (
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
                            Información Básica
                        </h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                Nombre del Restaurante *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Ej: Restaurante El Sabor"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #E0E0E0',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                Descripción
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
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
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    placeholder="3001234567"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E0E0E0',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="contacto@restaurante.com"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E0E0E0',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Ubicación */}
                {currentStep === 2 && (
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
                            Ubicación
                        </h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                Dirección Completa *
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="Calle 123 #45-67, Barrio Centro"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #E0E0E0',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                Ciudad/Municipio
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                readOnly
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #E0E0E0',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'not-allowed'
                                }}
                            />
                            <p style={{ fontSize: '12px', color: '#757575', marginTop: '4px' }}>
                                📍 Por ahora solo operamos en Samacá, Boyacá
                            </p>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600' }}>
                                    Ubicación GPS (Recomendado)
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={handleSearchInMap}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#2196F3',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        🗺️ Buscar en Mapa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        disabled={loading}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: loading ? '#BDBDBD' : '#4CAF50',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        📍 {loading ? 'Obteniendo...' : 'Mi Ubicación'}
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'start' }}>
                                <div>
                                    <input
                                        type="text"
                                        value={formData.coordinates.lat}
                                        onChange={(e) => handleChange('coordinates', { ...formData.coordinates, lat: e.target.value })}
                                        onPaste={(e) => {
                                            const pastedText = e.clipboardData.getData('text')
                                            if (pastedText.includes(',')) {
                                                e.preventDefault()
                                                handleCoordinatesPaste(pastedText)
                                            }
                                        }}
                                        placeholder="5.123456 o pega: 5.123456, -73.123456"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E0E0E0',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <p style={{ fontSize: '11px', color: '#757575', marginTop: '4px' }}>
                                        Latitud
                                    </p>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={formData.coordinates.lng}
                                        onChange={(e) => handleChange('coordinates', { ...formData.coordinates, lng: e.target.value })}
                                        placeholder="-73.123456"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E0E0E0',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <p style={{ fontSize: '11px', color: '#757575', marginTop: '4px' }}>
                                        Longitud
                                    </p>
                                </div>
                                <div style={{ paddingTop: '0px' }}>
                                    <button
                                        type="button"
                                        onClick={() => getAddressFromCoordinates()}
                                        disabled={loading || !formData.coordinates.lat || !formData.coordinates.lng}
                                        style={{
                                            padding: '12px 16px',
                                            backgroundColor: loading || !formData.coordinates.lat || !formData.coordinates.lng ? '#BDBDBD' : '#FF6B35',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: loading || !formData.coordinates.lat || !formData.coordinates.lng ? 'not-allowed' : 'pointer',
                                            whiteSpace: 'nowrap',
                                            height: '48px'
                                        }}
                                    >
                                        {loading ? '⏳' : '📍'} Obtener Dirección
                                    </button>
                                    <p style={{ fontSize: '11px', color: '#757575', marginTop: '4px', textAlign: 'center' }}>
                                        Clic aquí
                                    </p>
                                </div>
                            </div>
                            {formData.coordinates.lat && formData.coordinates.lng && (
                                <div style={{
                                    marginTop: '12px',
                                    padding: '12px',
                                    backgroundColor: '#E8F5E9',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#2E7D32'
                                }}>
                                    ✅ Ubicación guardada: {formData.coordinates.lat}, {formData.coordinates.lng}
                                    <br />
                                    <a
                                        href={`https://www.google.com/maps?q=${formData.coordinates.lat},${formData.coordinates.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#1976D2', textDecoration: 'underline', fontSize: '12px' }}
                                    >
                                        Ver en Google Maps →
                                    </a>
                                </div>
                            )}
                            <div style={{
                                marginTop: '12px',
                                padding: '12px',
                                backgroundColor: '#E3F2FD',
                                borderRadius: '8px',
                                fontSize: '12px',
                                color: '#1565C0'
                            }}>
                                <strong>💡 Tres formas de obtener tu ubicación:</strong>
                                <br />
                                <br />
                                <strong>1. GPS Automático:</strong> Haz clic en "Mi Ubicación" (debes estar en tu negocio)
                                <br />
                                <br />
                                <strong>2. Buscar en Mapa:</strong>
                                <br />
                                • Haz clic en "🗺️ Buscar en Mapa"
                                <br />
                                • Busca tu negocio en Google Maps
                                <br />
                                • Haz clic derecho en la ubicación exacta
                                <br />
                                • Copia las coordenadas (aparecen arriba)
                                <br />
                                • Pégalas en el campo de Latitud (detecta automáticamente ambas)
                                <br />
                                • Haz clic en "📍 Obtener Dirección"
                                <br />
                                • ¡La dirección se completará automáticamente!
                                <br />
                                <br />
                                <strong>3. Manual:</strong> Ingresa las coordenadas por separado y haz clic en "Obtener Dirección"
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Configuración de Negocio */}
                {currentStep === 3 && (
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
                            Configuración de Negocio
                        </h2>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                Tipo de Cocina *
                            </label>
                            <select
                                value={formData.cuisine_type}
                                onChange={(e) => handleChange('cuisine_type', e.target.value)}
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
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Domicilio
                                </label>
                                <input
                                    type="number"
                                    value={formData.delivery_fee}
                                    onChange={(e) => handleChange('delivery_fee', e.target.value)}
                                    placeholder="5000"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E0E0E0',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Pedido Mínimo
                                </label>
                                <input
                                    type="number"
                                    value={formData.min_order}
                                    onChange={(e) => handleChange('min_order', e.target.value)}
                                    placeholder="15000"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E0E0E0',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Tiempo Entrega
                                </label>
                                <input
                                    type="text"
                                    value={formData.delivery_time}
                                    onChange={(e) => handleChange('delivery_time', e.target.value)}
                                    placeholder="30-45 min"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #E0E0E0',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                                Especialidades (Selecciona las que ofreces)
                            </label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                gap: '12px',
                                marginBottom: '16px'
                            }}>
                                {AVAILABLE_SPECIALTIES.map((specialty) => {
                                    const isSelected = formData.specialties.includes(specialty.id)
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
                                                    fontSize: '12px'
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

                            {/* Especialidades seleccionadas */}
                            {formData.specialties.length > 0 && (
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#E8F5E9',
                                    borderRadius: '8px',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#2E7D32', marginBottom: '8px' }}>
                                        ✅ Seleccionadas ({formData.specialties.length}):
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {formData.specialties.map(id => {
                                            const specialty = AVAILABLE_SPECIALTIES.find(s => s.id === id)
                                            if (!specialty) return null
                                            return (
                                                <span
                                                    key={id}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#fff',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        border: '1px solid #4CAF50'
                                                    }}
                                                >
                                                    {specialty.icon} {specialty.name}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Campo para agregar especialidades personalizadas */}
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#F5F5F5',
                                borderRadius: '8px',
                                border: '1px dashed #BDBDBD'
                            }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#757575' }}>
                                    ¿No encuentras tu especialidad? Agrégala aquí:
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        id="custom-specialty"
                                        placeholder="Ej: Comida Vegana, Brunch, etc."
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            border: '1px solid #E0E0E0',
                                            borderRadius: '6px',
                                            fontSize: '13px'
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                const input = e.target
                                                const value = input.value.trim()
                                                if (value && !formData.specialties.includes(value)) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        specialties: [...prev.specialties, value]
                                                    }))
                                                    input.value = ''
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('custom-specialty')
                                            const value = input.value.trim()
                                            if (value && !formData.specialties.includes(value)) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    specialties: [...prev.specialties, value]
                                                }))
                                                input.value = ''
                                            }
                                        }}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#4CAF50',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        + Agregar
                                    </button>
                                </div>
                                <p style={{ fontSize: '11px', color: '#757575', marginTop: '6px' }}>
                                    Presiona Enter o haz clic en "Agregar"
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Horarios */}
                {currentStep === 4 && (
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
                            Horarios de Atención
                        </h2>

                        {Object.entries(formData.schedule).map(([day, hours]) => {
                            const dayNames = {
                                monday: 'Lunes',
                                tuesday: 'Martes',
                                wednesday: 'Miércoles',
                                thursday: 'Jueves',
                                friday: 'Viernes',
                                saturday: 'Sábado',
                                sunday: 'Domingo'
                            }

                            return (
                                <div key={day} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '120px 1fr 1fr 100px',
                                    gap: '12px',
                                    alignItems: 'center',
                                    marginBottom: '12px',
                                    padding: '12px',
                                    backgroundColor: hours.closed ? '#f5f5f5' : '#fff',
                                    borderRadius: '8px',
                                    border: '1px solid #E0E0E0'
                                }}>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                        {dayNames[day]}
                                    </div>
                                    <input
                                        type="time"
                                        value={hours.open}
                                        onChange={(e) => handleScheduleChange(day, 'open', e.target.value)}
                                        disabled={hours.closed}
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #E0E0E0',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <input
                                        type="time"
                                        value={hours.close}
                                        onChange={(e) => handleScheduleChange(day, 'close', e.target.value)}
                                        disabled={hours.closed}
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #E0E0E0',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                        <input
                                            type="checkbox"
                                            checked={hours.closed}
                                            onChange={(e) => handleScheduleChange(day, 'closed', e.target.checked)}
                                        />
                                        Cerrado
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Step 5: Confirmación */}
                {currentStep === 5 && (
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
                            Confirma tu Información
                        </h2>

                        <div style={{
                            backgroundColor: '#f5f5f5',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '24px'
                        }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                                📋 Resumen
                            </h3>
                            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                                <p><strong>Restaurante:</strong> {formData.name}</p>
                                <p><strong>Teléfono:</strong> {formData.phone}</p>
                                <p><strong>Dirección:</strong> {formData.address}</p>
                                <p><strong>Tipo de Cocina:</strong> {formData.cuisine_type}</p>
                                <p><strong>Domicilio:</strong> ${formData.delivery_fee}</p>
                                <p><strong>Pedido Mínimo:</strong> ${formData.min_order}</p>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#FFF3E0',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            fontSize: '14px',
                            color: '#E65100'
                        }}>
                            <strong>⚠️ Importante:</strong> Tu restaurante será revisado por nuestro equipo antes de ser activado. Te notificaremos por correo cuando esté aprobado.
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '32px',
                    gap: '16px'
                }}>
                    {currentStep > 1 && (
                        <button
                            onClick={prevStep}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '14px',
                                backgroundColor: '#E0E0E0',
                                color: '#212121',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Anterior
                        </button>
                    )}

                    {currentStep < 5 ? (
                        <button
                            onClick={nextStep}
                            style={{
                                flex: 1,
                                padding: '14px',
                                backgroundColor: '#FF6B35',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Siguiente
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '14px',
                                backgroundColor: loading ? '#BDBDBD' : '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Registrando...' : '✓ Finalizar Registro'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantOnboarding
