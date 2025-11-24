import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Para mejorar la UX en errores/éxito

// URL del microservicio de pedidos
const PEDIDOS_API_URL = 'http://localhost:8083/api/v1/pedidos';

// Funciones auxiliares para el carro (Mantendremos sessionStorage como caché temporal)
const obtenerCarro = () => JSON.parse(sessionStorage.getItem('carro') || '[]');
const guardarCarro = (carro) => {
    sessionStorage.setItem('carro', JSON.stringify(carro));
    window.dispatchEvent(new Event('carroActualizado'));
};

const Carro = () => {
    const navigate = useNavigate();
    const [carro, setCarro] = useState(obtenerCarro());
    const [cuponInput, setCuponInput] = useState('');
    const [totalBruto, setTotalBruto] = useState(0);
    const [totalFinal, setTotalFinal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Usuario actual (lo necesitaremos para el idUsuarioRef)
    const usuario = JSON.parse(sessionStorage.getItem('usuarioActual'));
    const idUsuario = usuario ? usuario.idUsuario : null;

    // Efecto para asegurar que el usuario esté logueado (Mejorado con Swal)
    useEffect(() => {
        if (!usuario) {
            Swal.fire({
                title: 'Acceso Denegado',
                text: 'Debes iniciar sesión para ver tu carrito de compras.',
                icon: 'warning',
                confirmButtonText: 'Ir a Iniciar Sesión'
            }).then(() => {
                navigate('/iniciar-sesion');
            });
        }
    }, [navigate, usuario]);

    // Función para calcular y actualizar el total (Mantenemos la lógica local de descuentos)
    const calcularTotales = () => {
        const currentCarro = obtenerCarro();
        let subtotal = currentCarro.reduce((sum, item) => sum + (item.precioFinal * item.cantidad), 0);
        let descuentoAplicado = 0;
        
        if (sessionStorage.getItem('cuponActivo') === 'FELICES50') {
            descuentoAplicado = subtotal * 0.10;
        }

        setTotalBruto(subtotal);
        setTotalFinal(Math.round(subtotal - descuentoAplicado)); // Redondear para evitar decimales
        setCarro(currentCarro);
    };

    // Recalcular cada vez que el carro cambia
    useEffect(() => {
        calcularTotales();
        window.addEventListener('carroActualizado', calcularTotales);
        return () => window.removeEventListener('carroActualizado', calcularTotales);
    }, []);

    // Manejadores de Cantidad y Eliminación (No cambian, solo gestionan la caché local)
    const handleQuantityChange = (idProductoRef, change) => {
        let newCarro = carro.map(item => 
            // Ojo: Usamos el idProductoRef, no el id antiguo
            item.idProducto === idProductoRef ? { ...item, cantidad: Math.max(1, item.cantidad + change) } : item
        );
        guardarCarro(newCarro);
    };

    const handleRemoveItem = (idProductoRef) => {
        let newCarro = carro.filter(item => item.idProducto !== idProductoRef);
        guardarCarro(newCarro);
    };

    // Lógica del Cupón (Usamos SweetAlert2)
    const handleCouponSubmit = (e) => {
        e.preventDefault();
        const cupon = cuponInput.toUpperCase();
        if (cupon === 'FELICES50') {
            sessionStorage.setItem('cuponActivo', 'FELICES50');
            Swal.fire('Aplicado', '¡Cupón aplicado con éxito! 10% de descuento.', 'success');
        } else {
            sessionStorage.removeItem('cuponActivo');
            Swal.fire('Error', 'Cupón inválido.', 'error');
        }
        calcularTotales();
        setCuponInput('');
    };

    // 🛑 FUNCIÓN DE PAGO REFATORIZADA 🛑
    const handlePagar = async () => {
        if (carro.length === 0) {
            Swal.fire('Vacío', 'El carrito está vacío. Agrega productos para pagar.', 'warning');
            return;
        }
        if (!idUsuario) {
            Swal.fire('Error', 'Debes iniciar sesión para procesar el pago.', 'error');
            return;
        }

        setLoading(true);

        try {
            // 1. CONSTRUIR EL OBJETO PEDIDO DTO
            const detallesDTO = carro.map(item => ({
                idProductoRef: item.idProducto, // Ojo: usamos idProducto
                nombreProducto: item.nombre,
                precioUnitario: item.precioFinal, // Ya tiene el descuento general aplicado
                cantidad: item.cantidad
            }));

            const pedidoDTO = {
                idUsuarioRef: idUsuario,
                total: totalFinal,
                detalles: detallesDTO
            };

            // 2. LLAMADA AXIOS POST al Backend de Pedidos
            const response = await axios.post(PEDIDOS_API_URL, pedidoDTO);
            
            // 3. Éxito: Limpieza y Redirección
            sessionStorage.removeItem('carro');
            sessionStorage.removeItem('cuponActivo');
            
            Swal.fire({
                title: '¡Compra Exitosa!',
                text: response.data, // Mensaje del backend: "Pedido creado con éxito. ID: X"
                icon: 'success',
                showConfirmButton: true
            }).then(() => {
                navigate('/pedidos'); // Ir a la página de historial de pedidos
            });

        } catch (error) {
            console.error("Error al procesar el pago:", error);
            let msg = 'Ocurrió un error al intentar generar el pedido.';
            if (error.response && error.response.data) {
                msg = `Error: ${error.response.data}`;
            }
            Swal.fire('Error de Pago', msg, 'error');
        } finally {
            setLoading(false);
            window.dispatchEvent(new Event('storageChange')); // Actualiza el Header
        }
    };

    // Si el usuario no existe, no renderizamos nada (para evitar un flash antes del redirect)
    if (!usuario) {
        return null; 
    }
    
    return (
        <div className="container my-5">
            {/* ... JSX sigue igual ... */}
            <h1 className="text-center mb-4">Mi carrito de compras</h1>
            <div className="row">
                <div className="col-md-8" id="cart-items">
                    {carro.length === 0 ? (
                            <div className="alert alert-warning text-center">Tu carrito de compras está vacío.</div>
                    ) : (
                        carro.map(item => (
                            <div key={item.idProducto} className="d-flex align-items-center mb-4 p-3 border-bottom">
                                <div className="card-img-container me-3" style={{ width: '150px', height: '150px' }}>
                                    <img src={`/images/${item.urlImagen}`} alt={item.nombre} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                                </div>
                                <div className="ms-3 flex-grow-1">
                                    <h4>{item.nombre}</h4>
                                    <p className="h5">
                                        <strong>${(item.precioFinal * item.cantidad).toLocaleString('es-CL')}</strong>
                                    </p>
                                    <div className="d-flex align-items-center">
                                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleQuantityChange(item.idProducto, -1)} disabled={item.cantidad <= 1}>-</button>
                                        <span className="me-2">Cantidad: {item.cantidad}</span>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(item.idProducto, 1)}>+</button>
                                        <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => handleRemoveItem(item.idProducto)}>Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="col-md-4">
                    <div className="card p-3 sticky-top">
                        <h4 className="text-center">Resumen del Carro</h4>
                        <hr />
                        
                        <p>Subtotal (sin descuentos): ${totalBruto.toLocaleString('es-CL')}</p>
                        
                        {totalBruto !== totalFinal && (
                            <p className="text-success fw-bold">Descuento Aplicado: - ${(totalBruto - totalFinal).toLocaleString('es-CL')}</p>
                        )}
                        
                        <div className="d-flex justify-content-between mb-3 border-top pt-2">
                            <span>Total Final:</span>
                            <strong id="cart-total" className='h5'>${totalFinal.toLocaleString('es-CL')}</strong>
                        </div>
                        
                        <form id="coupon-form" className="input-group mb-3" onSubmit={handleCouponSubmit}>
                            <input type="text" className="form-control" id="coupon-input" 
                                placeholder="Ingresa el cupón" value={cuponInput} 
                                onChange={(e) => setCuponInput(e.target.value)} 
                                aria-label="Cupón de descuento" 
                                disabled={loading}
                            />
                            <button className="btn btn-outline-secondary" type="submit" disabled={loading}>APLICAR</button>
                        </form>
                        
                        <button className="btn btn-primary btn-lg mt-3" onClick={handlePagar} disabled={carro.length === 0 || loading}>
                            {loading ? 
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Procesando...
                                </>
                            : `PAGAR ($${totalFinal.toLocaleString('es-CL')})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carro;