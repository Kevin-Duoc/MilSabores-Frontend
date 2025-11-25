import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_URLS } from '../config/api';

const PedidosCliente = () => {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState([]);
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            // 1. Verificar sesión
            const user = JSON.parse(sessionStorage.getItem('usuarioActual'));
            if (!user) {
                navigate('/iniciar-sesion');
                return;
            }
            setUsuarioActual(user);

            // 2. Cargar pedidos desde AWS
            try {
                // Llamada al microservicio: GET /api/v1/pedidos/usuario/{id}
                // Asumiendo que tu Controller tiene un método para buscar por ID Usuario
                // Si tu endpoint es diferente (ej: solo /pedidos), avísame.
                const response = await axios.get(`${API_URLS.PEDIDOS}/usuario/${user.idUsuario}`);
                
                // Ordenar por fecha (o ID) descendente si el backend no lo hace
                const pedidosOrdenados = response.data.sort((a, b) => b.idPedido - a.idPedido);
                setPedidos(pedidosOrdenados);
                
            } catch (err) {
                console.error("Error cargando pedidos:", err);
                // Si es 404, puede ser que no tenga pedidos aún, no es necesariamente un error grave
                if (err.response && err.response.status === 404) {
                    setPedidos([]);
                } else {
                    setError("No pudimos cargar tus pedidos. Intenta más tarde.");
                }
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [navigate]);

    if (!usuarioActual) return null;

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2">Buscando tus pedidos...</p>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <section className="row justify-content-center">
                <div className="col-lg-10">
                    <h1 className="text-center mb-5 section-title">Mis Pedidos</h1>
                    
                    {error && <div className="alert alert-danger text-center">{error}</div>}

                    <div id="lista-pedidos">
                        {pedidos.length === 0 && !error ? (
                            <div className="alert alert-info text-center p-5 shadow-sm">
                                <h4>Aún no has realizado ningún pedido.</h4>
                                <p>¡Nuestros pasteles te están esperando!</p>
                                <button className="btn btn-primary mt-3" onClick={() => navigate('/productos')}>
                                    Ir a la Tienda
                                </button>
                            </div>
                        ) : (
                            pedidos.map((pedido) => (
                                <div key={pedido.idPedido} className="card mb-4 shadow-sm border-0">
                                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="badge bg-primary me-2">Pedido #{pedido.idPedido}</span>
                                            {new Date(pedido.fecha || pedido.fechaPedido || Date.now()).toLocaleDateString('es-CL')}
                                        </div>
                                        <div>
                                            {/* Badge de estado (puedes personalizar colores según estado) */}
                                            <span className={`badge ${pedido.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                {pedido.estado}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <h6 className="card-subtitle mb-3 text-muted">Detalle de productos:</h6>
                                                <ul className="list-group list-group-flush">
                                                    {pedido.detalles && pedido.detalles.map((detalle, index) => (
                                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                            <div>
                                                                <span className="fw-bold">{detalle.nombreProducto}</span>
                                                                <span className="text-muted ms-2">x{detalle.cantidad}</span>
                                                            </div>
                                                            <span>${detalle.precioUnitario.toLocaleString('es-CL')}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="col-md-4 border-start d-flex flex-column justify-content-center align-items-end">
                                                <p className="mb-0 text-muted">Total a pagar:</p>
                                                <h3 className="text-primary fw-bold">${pedido.total.toLocaleString('es-CL')}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PedidosCliente;