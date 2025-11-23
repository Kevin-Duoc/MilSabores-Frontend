import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LOGO_PATH = '/images/logo_empresa.png';

const Header = () => {
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    const handleLogout = () => {
        sessionStorage.clear();
        window.dispatchEvent(new Event('storageChange')); 
        window.location.href = '/'; 
    };

    const updateState = () => {
        try {
            const currentCart = JSON.parse(sessionStorage.getItem('carro') || '[]');
            setCartCount(currentCart.reduce((total, item) => total + item.cantidad, 0));
            setUsuarioActual(JSON.parse(sessionStorage.getItem('usuarioActual')));
        } catch (error) {
            setCartCount(0);
            setUsuarioActual(null);
        }
    };

    useEffect(() => {
        updateState();
        const handleChange = () => updateState();
        window.addEventListener('storageChange', handleChange);
        window.addEventListener('carroActualizado', handleChange); 
        return () => {
            window.removeEventListener('storageChange', handleChange);
            window.removeEventListener('carroActualizado', handleChange);
        };
    }, []);

    const shouldShowAdminPanel = usuarioActual && 
        (usuarioActual.rol === 'administrador' || usuarioActual.rol === 'vendedor');

    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img 
                            src={LOGO_PATH} 
                            alt="Logo" 
                            style={{ height: '40px', marginRight: '10px' }} 
                        />
                        <span className="site-name">Pastelería 1000 Sabores</span>
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/blogs">Blogs</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/categorias">Categorías</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/ofertas">Ofertas</Link></li>
                        </ul>

                        <div className="d-flex align-items-center" id="nav-right">
                            {usuarioActual ? (
                                <div className="d-flex align-items-center">
                                    {shouldShowAdminPanel && (
                                        <Link to="/admin" className="nav-link-personalizado me-2" style={{background: 'red'}}>Panel Admin</Link>
                                    )}
                                    <div className="dropdown me-2">
                                        <button className="nav-link-personalizado dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                            Hola, {usuarioActual.nombreCompleto?.split(' ')[0]}
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li><Link className="dropdown-item" to="/ajustes">Ajustes</Link></li>
                                            <li><Link className="dropdown-item" to="/pedidos">Ver pedidos</Link></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex">
                                    <Link className="nav-link-personalizado" to="/iniciar-sesion">Ingresar</Link>
                                    <Link className="nav-link-personalizado" to="/registro" style={{backgroundColor: '#E9967A'}}>Registrarse</Link>
                                </div>
                            )}

                            <Link className="nav-link-personalizado" to="/carro" style={{backgroundColor: '#FFC107', color: 'black'}}>
                                <i className="material-icons" style={{verticalAlign: 'middle'}}>shopping_cart</i> Carro ({cartCount})
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;