import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// URL del endpoint de ofertas activas
const OFERTAS_API_URL = 'http://localhost:8082/api/v1/catalogo/productos/ofertas';

// Componente para mostrar una sola tarjeta de oferta
const OfertaCard = ({ producto }) => {
    // Los campos vienen del OfertaProductoDto
    const imagePath = `/images/${producto.urlImagen}`; 
    const productUrl = `/productos/${producto.idProducto}`;

    return (
        <div className="col-md-4 mb-4">
            <div className="card text-center p-3 border-danger h-100 shadow-sm">
                <div className="card-img-container mb-3" style={{ height: '180px' }}>
                    <img 
                        src={imagePath} 
                        alt={producto.nombre} 
                        className="card-image"
                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                        onError={(e) => { e.target.src = '/images/default.jpg'; }}
                    />
                </div>
                
                <h4 className='text-danger'>{producto.nombre}</h4>
                
                {/* PRECIO TACHADO (NORMAL) */}
                <p className='text-muted mb-0' style={{ textDecoration: 'line-through' }}>
                    Precio: ${producto.precioNormal.toLocaleString('es-CL')}
                </p>

                {/* PRECIO FINAL DE OFERTA */}
                <h3 className='text-success fw-bold mb-2'>
                    ¡Ahora ${producto.precioOferta.toLocaleString('es-CL')}!
                </h3>
                
                <p className='text-danger fw-bold'>
                    {producto.porcentajeOferta}% OFF - ¡TEMPORAL!
                </p>

                <Link to={productUrl} className="btn btn-primary mt-auto">Ver Oferta</Link>
            </div>
        </div>
    );
};


const Ofertas = () => {
    const [ofertas, setOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Efecto para cargar los datos de las ofertas activas
    useEffect(() => {
        const fetchOfertas = async () => {
            try {
                const response = await axios.get(OFERTAS_API_URL);
                setOfertas(response.data);
            } catch (err) {
                setError("Error al cargar las ofertas del servidor.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOfertas();
    }, []);

    if (loading) {
        return <h2 className='text-center my-5'>Buscando ofertas...</h2>;
    }

    if (error) {
        return <h2 className='text-center my-5 text-danger'>{error}</h2>;
    }

    return (
        <div className="container my-5">
            <h1 className='text-center section-title mb-4'>🔥 OFERTAS ESPECIALES ACTIVAS</h1>
            <p className='text-center mb-5 text-muted'>¡Aprovecha antes de que terminen! (Válidas por tiempo limitado)</p>
            
            <section className="row mt-5 justify-content-center">
                {ofertas.length === 0 ? (
                    <div className="alert alert-info text-center col-md-6">
                        No hay ofertas activas en este momento. Vuelve pronto.
                    </div>
                ) : (
                    ofertas.map((productoOferta) => (
                        <OfertaCard 
                            key={productoOferta.idProducto} 
                            producto={productoOferta} 
                        />
                    ))
                )}
            </section>
        </div>
    );
};

export default Ofertas;