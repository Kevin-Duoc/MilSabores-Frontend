import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URLS } from '../config/api';

// Componente para una tarjeta de Categoría reutilizable
const CategoriaCard = ({ categoria, onSelectCategory }) => {
    // Usamos el nombre y el ID que vienen de la BD
    
    // Nota: Tu BD no guarda URL_IMAGEN para CATEGORIAS, así que usamos un placeholder/logo temporal.
    const imagePath = '/images/logo_empresa.png'; // Placeholder

    // Al hacer clic, llamamos a la función principal para que cargue los productos
    const handleSelect = () => {
        onSelectCategory(categoria.idCategoria, categoria.nombre);
    };

    return (
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="card text-center h-100">
                <div className="card-img-container" style={{ height: '180px' }}>
                    <img src={imagePath} alt={categoria.nombre} className="card-img-top" style={{ objectFit: 'contain' }} />
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">{categoria.nombre}</h5>
                    <button onClick={handleSelect} className="btn btn-primary mt-2">
                        Ver Productos
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente para una tarjeta de Producto (Reutilizamos la lógica del catálogo)
// Asumo que este componente existe y funciona:
const ProductCard = ({ producto }) => {
    const imagePath = `/images/${producto.urlImagen}`; // Usa el campo correcto del DTO
    const productUrl = `/productos/${producto.idProducto}`;

    return (
        <div className="col-md-3 mb-4">
            <div className="card h-100">
                <div className="card-img-container">
                    <img src={imagePath} className="card-img-top" alt={producto.nombre} onError={(e) => { e.target.src = '/images/default.jpg'; }} />
                </div>
                <div className="card-body text-center d-flex flex-column">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text flex-grow-1">
                        <strong>${producto.precio.toLocaleString('es-CL')}</strong>
                    </p>
                    <Link to={productUrl} className="btn btn-primary mt-auto">Ver detalle</Link>
                </div>
            </div>
        </div>
    );
};


const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API_URLS.CATALOGO ya es 'http://52...:8082/api/v1/catalogo'
    const PRODUCTOS_API_URL = `${API_URLS.CATALOGO}/productos/categoria`; 
    const CATEGORIAS_API_URL = `${API_URLS.CATALOGO}/categorias`;


    // 1. Efecto: Cargar todas las categorías al montar
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(CATEGORIAS_API_URL);
                setCategorias(response.data);
            } catch (err) {
                setError("Error al cargar categorías.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategorias();
    }, []);

    // 2. Función: Cargar productos al seleccionar una categoría
    const handleSelectCategory = async (idCategoria, nombreCategoria) => {
        setProductosFiltrados([]); // Limpiar la lista anterior
        setCategoriaSeleccionada(nombreCategoria);
        setLoading(true);
        
        try {
            // Llamada al endpoint para traer productos por ID de categoría
            const response = await axios.get(`${PRODUCTOS_API_URL}/${idCategoria}`);
            setProductosFiltrados(response.data);
        } catch (err) {
            Swal.fire('Error', 'No se pudieron cargar los productos de esta categoría.', 'error');
            setProductosFiltrados([]);
        } finally {
            setLoading(false);
        }
    };


    if (loading && categorias.length === 0) {
        return <h2 className='text-center my-5'>Cargando categorías...</h2>;
    }

    if (error) {
        return <h2 className='text-center my-5 text-danger'>{error}</h2>;
    }

    return (
        <div className="container my-5">
            <h1 className="text-center mb-5 section-title">Explora por Categoría</h1>

            {/* MÓDULO SUPERIOR: TARJETAS DE NAVEGACIÓN */}
            <section className="row justify-content-center mb-5 border-bottom pb-4">
                {categorias.map((cat) => (
                    <CategoriaCard 
                        key={cat.idCategoria} 
                        categoria={cat} 
                        onSelectCategory={handleSelectCategory} 
                    />
                ))}
            </section>

            {/* MÓDULO INFERIOR: PRODUCTOS FILTRADOS */}
            {categoriaSeleccionada && (
                <div id="productos-filtrados-seccion">
                    <h2 className="mb-4">{categoriaSeleccionada}</h2>
                    <section className="row">
                        {loading ? (
                            <div className="text-center col-12">Cargando productos...</div>
                        ) : productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <ProductCard key={producto.idProducto} producto={producto} />
                            ))
                        ) : (
                            <div className="alert alert-info text-center col-12">
                                No hay productos en esta categoría.
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
};

export default Categorias;