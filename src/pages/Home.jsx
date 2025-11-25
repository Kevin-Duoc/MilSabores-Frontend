import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../config/api';
import ProductCard from '../components/common/ProductCard';

// Ruta del logo
const LOGO_PATH = '/images/logo_empresa.png';

const Home = () => {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- LÓGICA NUEVA (CONEXIÓN BACKEND) ---
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                // Conexión al backend (Puerto 8082) / 'http://localhost:8082...
                const response = await axios.get(`${API_URLS.CATALOGO}/productos`);
                
                // Tomamos los primeros 4 productos para mostrar en el Home (igual que antes)
                setProductosDestacados(response.data.slice(0, 4));
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos:", error);
                setLoading(false);
            }
        };
        cargarProductos();
    }, []);

    return (
        <div className="container my-5">
            {/* --- SECCIÓN HERO (BIENVENIDA) --- 
                Estructura HTML idéntica a tu original para que el CSS funcione.
            */}
            <section className="row align-items-center mb-5">
                <div className="col-md-6">
                    <span className="site-name"><h1>TIENDA 1000 SABORES</h1></span>
                    <p>Ofrecemos una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería.</p>
                    <Link to="/productos" className="btn btn-primary">Ver productos</Link>
                </div>
                <div className="col-md-6 text-center">
                    <div className="product-main-image-container">
                        <img src={LOGO_PATH} alt="logo de la empresa" className="company-logo" />
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN PRODUCTOS DESTACADOS --- */}
            <section className="row">
                <div className="col-12 text-center mb-4">
                    <h2>Nuestros Productos</h2>
                </div>
                
                {/* Renderizado condicional: Spinner o Productos */}
                {loading ? (
                    <div className="text-center w-100">
                        <div className="spinner-border text-warning" role="status"></div>
                    </div>
                ) : (
                    productosDestacados.map((producto) => (
                        // Usamos ProductCard con los datos reales de la BD
                        // OJO: La BD usa 'idProducto', no 'id'
                        <ProductCard key={producto.idProducto} producto={producto} />
                    ))
                )}
            </section>
        </div>
    );
};

export default Home;