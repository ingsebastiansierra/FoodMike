import React from 'react'

const OrderCard = ({ order, onClick }) => {
    const getStatusColor = (status) => {
        const colors = {
            pending: '#FFD93D',
            confirmed: '#4ECDC4',
            preparing: '#667eea',
            ready: '#6BCF7F',
            delivered: '#95E1D3',
            cancelled: '#FF6B6B',
        }
        return colors[status] || '#999'
    }

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pendiente',
            confirmed: 'Confirmado',
            preparing: 'Preparando',
            ready: 'Listo',
            delivered: 'Entregado',
            cancelled: 'Cancelado',
        }
        return texts[status] || status
    }

    const getPaymentMethodText = (method) => {
        const methods = {
            cash: '💵 Efectivo',
            transfer: '🏦 Transferencia',
            wompi: '💳 Wompi',
        }
        return methods[method] || method
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#212121' }}>
                        #{order.id.slice(0, 8)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#757575' }}>
                        {getPaymentMethodText(order.payment_method)}
                    </div>
                </div>
                <div style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: getStatusColor(order.status),
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#fff',
                    height: 'fit-content'
                }}>
                    {getStatusText(order.status)}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: order.payment_status === 'paid' ? '#4ECDC4' : '#FFD93D' }}>
                    {order.payment_status === 'paid' ? '✓ Pagado' : '⏱ Pendiente'}
                </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FF6B35' }}>
                    {formatCurrency(order.total)}
                </div>
                <div style={{ fontSize: '12px', color: '#757575' }}>
                    {new Date(order.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    )
}

export default OrderCard
