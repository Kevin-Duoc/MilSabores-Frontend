import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const LOGO_PATH = '/images/logo_empresa.png';
const AUTH_API_URL = 'http://localhost:8081/api/v1/auth/login';

const IniciarSesion = () => {
    const navigate = useNavigate();
    
    // Estados del formulario
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    
    // Estados de Feedback (Carga y Error)
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(''); // Limpiamos errores previos

        // 1. Validaciones Locales (Mantenemos las tuyas por UX)
        const emailRegex = /(@duoc.cl|@profesor.duoc.cl|@gmail.com)$/;
        if (!emailRegex.test(correo) || correo.length > 100) {
            setErrorMsg('El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return;
        }
        if (contrasena.length < 6) {
            setErrorMsg('La contraseña debe tener sobre 6 caracteres.');
            return;
        }

        // 2. Llamada al Backend
        setLoading(true);

        try {
            // Enviamos LoginDto { correo, contrasena }
            const response = await axios.post(AUTH_API_URL, {
                correo: correo,
                contrasena: contrasena
            });

            // 3. Éxito: El backend respondió 200 OK con el Token
            const data = response.data;
            
            // Creamos el objeto de sesión tal como lo espera tu app
            const usuarioSesion = {
                idUsuario: data.idUsuario,
                nombreCompleto: data.nombre,
                correo: correo,
                rol: data.rol, // 'administrador', 'cliente', etc.
                token: data.token // Guardamos el JWT por si lo necesitamos luego
            };

            // Guardamos en SessionStorage
            sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioSesion));
            
            // Disparamos evento para actualizar el Header (que muestre "Hola Juan")
            window.dispatchEvent(new Event('storageChange'));

            Swal.fire({
                title: '¡Bienvenido!',
                text: `Hola de nuevo, ${data.nombre.split(' ')[0]}`,
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
            }).then(() => {
                const rolUsuario = data.rol.toLowerCase(); 
                if (rolUsuario.includes('admin') || rolUsuario.includes('vendedor')) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            });

        } catch (err) {
            console.error("Error de login:", err);
            
            if (err.response) {
                // El servidor respondió con error (ej: 401 Credenciales incorrectas)
                if (err.response.status === 401) {
                    setErrorMsg('Correo o contraseña incorrectos.');
                } else {
                    setErrorMsg('Hubo un problema con el servidor. Intenta más tarde.');
                }
            } else {
                // No hubo respuesta (Backend apagado o puerto incorrecto)
                setErrorMsg('No se pudo conectar con el servidor de seguridad.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <section className="row justify-content-center">
                <div className="col-md-6">
                    <div className="text-center mb-4">
                        <div style={{ width: '100px', height: '100px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={LOGO_PATH} alt="logo de la empresa" className="company-logo" />
                        </div>
                        <h2 className="mt-3">Pastelería Mil Sabores</h2>
                    </div>
                    
                    <div className="card p-4 shadow-sm border-0">
                        <div className="card-body">
                            <span className="site-name">
                                <h4 className="card-title text-center mb-4">Iniciar sesión</h4>
                            </span>
                            
                            {/* Mensaje de Error Visual */}
                            {errorMsg && (
                                <div className="alert alert-danger text-center p-2" role="alert">
                                    {errorMsg}
                                </div>
                            )}

                            <form id="login-form" onSubmit={handleSubmit} className="row g-3">
                                <div className="text-center text-muted mb-2">
                                    <h6>Accede a tu cuenta para disfrutar de nuestros productos</h6>
                                </div>
                                
                                <div className="col-md-12">
                                    <label htmlFor="correo" className="form-label fw-bold">CORREO</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="correo" 
                                        required 
                                        value={correo} 
                                        onChange={(e) => setCorreo(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="col-md-12">
                                    <label htmlFor="contrasena" className="form-label fw-bold">CONTRASEÑA</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="contrasena" 
                                        required 
                                        value={contrasena} 
                                        onChange={(e) => setContrasena(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="col-12 text-center mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 py-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Ingresando...
                                            </>
                                        ) : 'Iniciar sesión'}
                                    </button>
                                </div>
                                
                                <div className="text-center mt-3">
                                    ¿No tienes cuenta?{' '}
                                    <Link to="/registro" className="registro-link fw-bold">Regístrate aquí</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default IniciarSesion;
