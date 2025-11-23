import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LOGO_PATH = '/images/logo_empresa.png';

// --- Funciones auxiliares (Mantenemos tu lógica original) ---
const obtenerCarro = () => {
    const carro = sessionStorage.getItem('carro');
    return carro ? JSON.parse(carro) : [];
};

const guardarCarro = (carro) => {
    sessionStorage.setItem('carro', JSON.stringify(carro));
    window.dispatchEvent(new Event('carroActualizado')); 
};

const obtenerDescuento = () => {
    if (sessionStorage.getItem('descuentoCincuenta')) return 50;
    else if (sessionStorage.getItem('descuentoFelices50')) return 10;
    else if (sessionStorage.getItem('descuentoDuoc')) return 10;
    return 0;
};
// ----------------------------------------------------

const DetalleProducto = () => {
    const { id } = useParams(); // Captura el ID de la URL (ej: 1)
    const navigate = useNavigate();
    
    // Estados para manejar datos asíncronos
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados de lógica de negocio
    const [cantidad, setCantidad] = useState(1);
    const [precioDisplay, setPrecioDisplay] = useState(0);
    const [precioFinal, setPrecioFinal] = useState(0);
    const [descuento, setDescuento] = useState(0);

    // 1. EFECTO: Cargar el producto desde el Backend
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                // Llamada a tu API Java
                const response = await axios.get(`http://localhost:8082/api/v1/catalogo/productos/${id}`);
                setProducto(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error cargando producto:", err);
                setError("No pudimos encontrar el pastel que buscas.");
                setLoading(false);
            }
        };
        fetchProducto();
    }, [id]);

    // 2. EFECTO: Calcular precios cuando el producto ya cargó
    useEffect(() => {
        if (producto) {
            const dcto = obtenerDescuento();
            const precioBase = producto.precio;
            const precioConDescuento = Math.round(precioBase * (1 - dcto / 100));
            
            setDescuento(dcto);
            setPrecioDisplay(precioBase);
            setPrecioFinal(precioConDescuento);
        }
    }, [producto]);

    // Lógica para añadir al carro
    const handleAddToCart = () => {
        // Verificación de sesión (Tal como lo tenías)
        if (!sessionStorage.getItem('usuarioActual')) {
            alert('Debes iniciar sesión o registrarte para añadir productos al carro.');
            navigate('/iniciar-sesion');
            return;
        }

        if (cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0.');
            return;
        }

        let carro = obtenerCarro();
        // OJO: En la BD el ID viene como idProducto, ajustamos la búsqueda
        const itemExistente = carro.find(item => item.idProducto === producto.idProducto);

        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carro.push({ 
                ...producto, 
                cantidad, 
                precioFinal: precioFinal 
            });
        }
        
        guardarCarro(carro);
        alert(`${cantidad} ${producto.nombre}(s) agregado(s) al carro.`);
    };

    // --- RENDERIZADO CONDICIONAL ---

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p>Buscando ingredientes...</p>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <div className="container my-5 text-center">
                <h2 className="text-danger">Producto no encontrado</h2>
                <Link to="/productos" className="btn btn-outline-primary mt-3">Volver al catálogo</Link>
            </div>
        );
    }

    // Adaptación de ruta de imagen (Backend manda 'torta.jpg')
    const imagePath = `/images/${producto.urlImagen}`;

    return (
        <div className="container my-5" id="product-detail-container">
            {/* Botón volver */}
            <div className="mb-4">
                <Link to="/productos" className="btn btn-outline-secondary btn-sm">&larr; Volver al catálogo</Link>
            </div>

            <div className="row">
                <div className="col-md-6">
                    {/* Imagen Principal */}
                    <div className="product-main-image-container border rounded p-3 bg-white">
                        <img 
                            id="product-image" 
                            src={imagePath} 
                            alt={producto.nombre} 
                            className="product-main-image img-fluid"
                            onError={(e) => { e.target.src = '/images/default.jpg'; }} 
                        />
                    </div>
                    {/* Miniaturas (Ahora muestran la foto del producto) */}
                    <div className="d-flex mt-3 justify-content-center" id="miniaturas-container">
                        {/* Miniatura 1 */}
                        <div className="product-thumbnail me-2">
                            <img src={imagePath} alt="Vista 1" onError={(e) => { e.target.src = '/images/default.jpg'; }} />
                        </div>
                        
                        {/* Miniatura 2 */}
                        <div className="product-thumbnail me-2">
                            <img src={imagePath} alt="Vista 2" onError={(e) => { e.target.src = '/images/default.jpg'; }} />
                        </div>
                        
                        {/* Miniatura 3 (Opcional, si quieres una tercera) */}
                        <div className="product-thumbnail">
                            <img src={imagePath} alt="Vista 3" onError={(e) => { e.target.src = '/images/default.jpg'; }} />
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <h1 id="product-name" className="display-5 fw-bold text-brown">{producto.nombre}</h1>
                    <p className="text-muted">SKU: {producto.codigoSku}</p>
                    
                    {/* Precios */}
                    <div className="my-3">
                        {descuento > 0 ? (
                            <>
                                <span className="text-muted text-decoration-line-through me-2 fs-4">
                                    ${precioDisplay.toLocaleString('es-CL')}
                                </span>
                                <span className="text-success fw-bold fs-2">
                                    ${precioFinal.toLocaleString('es-CL')}
                                </span>
                                <div className="badge bg-success ms-2">{descuento}% OFF</div>
                            </>
                        ) : (
                            <span className="fw-bold fs-2 text-brown">
                                ${precioFinal.toLocaleString('es-CL')}
                            </span>
                        )}
                    </div>

                    <p id="product-description" className="lead fs-6">{producto.descripcion}</p>
                    
                    {/* Control de Stock y Cantidad */}
                    <div className="card bg-light border-0 p-3 mt-4">
                        <p className={`mb-2 ${producto.stock < 5 ? 'text-danger fw-bold' : 'text-success'}`}>
                            Stock disponible: {producto.stock} unidades
                        </p>

                        <div className="d-flex align-items-center mb-3">
                            <label htmlFor="cantidad" className="form-label me-3 fw-bold mb-0">Cantidad:</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                id="cantidad" 
                                value={cantidad} 
                                onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                                min="1" 
                                max={producto.stock} // Limitamos al stock real
                                style={{ width: '80px' }} 
                            />
                        </div>
                        
                        <button 
                            className="btn btn-primary w-100 btn-lg" 
                            onClick={handleAddToCart}
                            disabled={producto.stock === 0}
                        >
                            {producto.stock === 0 ? 'Agotado' : 'Añadir al carro'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleProducto;