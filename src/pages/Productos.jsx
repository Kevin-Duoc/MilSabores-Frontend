import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URLS } from '../config/api';
// Componente Tarjeta Interno (Adaptado a tus DTOs)
const ProductCard = ({ producto }) => {
    // Mapeo de campos del DTO:
    // producto.urlImagen -> Nombre del archivo (ej: "torta_selva.jpg")
    // Asumimos que las imágenes siguen estando en la carpeta public/images/ del front
    const imagePath = `/images/${producto.urlImagen}`; 
    const productUrl = `/productos/${producto.idProducto}`; // Ojo: idProducto

    return (
        <div className="col-md-3 mb-4">
            <div className="card h-100">
                <div className="card-img-container">
                    <img 
                        src={imagePath} 
                        className="card-img-top" 
                        alt={producto.nombre}
                        // Si la imagen falla (o viene null del backend), ponemos una por defecto
                        onError={(e) => { e.target.src = '/images/default.jpg'; }} 
                    />
                </div>
                <div className="card-body text-center d-flex flex-column">
                    <h5 className="card-title">{producto.nombre}</h5>
                    
                    {/* Mostramos precio formateado */}
                    <p className="card-text flex-grow-1">
                        <strong>
                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio)}
                        </strong>
                    </p>
                    
                    {/* Botón usando tus clases */}
                    <Link to={productUrl} className="btn btn-primary mt-auto">
                        Ver detalle
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Productos = () => {
    // Estados
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Efecto para cargar datos al montar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                // Conexión al endpoint real del microservicio
                //'http://52.73.124.122:8082/api/v1/catalogo/productos'
                const response = await axios.get(`${API_URLS.CATALOGO}/productos`);
                
                // Si la respuesta es exitosa (200 OK), guardamos los datos
                setProductos(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error al conectar con el backend:", err);
                setError("No pudimos conectar con el catálogo de Mil Sabores. Intenta más tarde.");
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    // 1. Estado de Carga
    if (loading) {
        return (
            <div className="container my-5 text-center" style={{ minHeight: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Consultando el horno...</p>
            </div>
        );
    }

    // 2. Estado de Error
    if (error) {
        return (
            <div className="container my-5 text-center">
                <h3 className="text-danger">¡Ups! Algo salió mal</h3>
                <p>{error}</p>
                <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
                    Reintentar
                </button>
            </div>
        );
    }

    // 3. Estado Exitoso (Mostrar lista)
    return (
        <div className="container my-5">
            <h1 className='text-center section-title mb-4'>Nuestros Productos</h1>
            <p className='text-center text-muted mb-5'>Aquí puedes ver todo nuestro catálogo disponible.</p>
            
            <section className="row">
                {productos.length > 0 ? (
                    productos.map((producto) => (
                        // Usamos idProducto como key única
                        <ProductCard key={producto.idProducto} producto={producto} />
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p>No hay productos disponibles en este momento.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Productos;