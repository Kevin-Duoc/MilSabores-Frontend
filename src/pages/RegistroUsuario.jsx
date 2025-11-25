import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_URLS } from '../config/api';

const LOGO_PATH = '/images/logo_empresa.png';

// --- ENDPOINTS ---
// Ajusta el puerto (8081 u 8082) según tu backend
const REGISTER_API_URL = `${API_URLS.AUTH}/register`;
const LOGIN_API_URL    = `${API_URLS.AUTH}/login`;

const RegistroUsuario = () => {
    const navigate = useNavigate();

    // --- DATOS GEOGRÁFICOS ---
    const datosGeograficos = [
        { 
            id: 1, nombre: 'Metropolitana', 
            comunas: [ {id:1,nombre:'Santiago'}, {id:2,nombre:'Providencia'}, {id:3,nombre:'Las Condes'}, {id:4,nombre:'Maipú'} ]
        },
        { 
            id: 2, nombre: 'Valparaíso', 
            comunas: [ {id:5,nombre:'Valparaíso'}, {id:6,nombre:'Viña del Mar'}, {id:7,nombre:'Quilpué'}, {id:8,nombre:'Villa Alemana'} ]
        },
        { 
            id: 3, nombre: 'Biobío', 
            comunas: [ {id:9,nombre:'Concepción'}, {id:10,nombre:'Talcahuano'}, {id:11,nombre:'San Pedro de la Paz'}, {id:12,nombre:'Chiguayante'} ]
        },
        { 
            id: 4, nombre: 'Coquimbo', 
            comunas: [ {id:13,nombre:'La Serena'}, {id:14,nombre:'Coquimbo'}, {id:15,nombre:'Ovalle'}, {id:16,nombre:'Illapel'} ]
        }
    ];

    const [formData, setFormData] = useState({
        nombreCompleto: '', correo: '', contrasena: '', confirmarContrasena: '',
        fechaNacimiento: '', telefono: '', idRegion: '', idComuna: '', codigoDescuento: ''
    });

    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (id === 'idRegion') {
            const reg = datosGeograficos.find(r => r.id === parseInt(value));
            setComunasDisponibles(reg ? reg.comunas : []);
            setFormData(prev => ({ ...prev, [id]: value, idComuna: '' }));
        }
    };

    const calcularEdad = (fecha) => {
        const diff_ms = Date.now() - new Date(fecha).getTime();
        return Math.abs(new Date(diff_ms).getUTCFullYear() - 1970);
    };

    // --- FUNCIÓN PRINCIPAL DE REGISTRO + LOGIN ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. VALIDACIONES
        if (formData.contrasena !== formData.confirmarContrasena) {
            Swal.fire('Error', 'Las contraseñas no coinciden.', 'error'); return;
        }
        if (formData.contrasena.length < 4) {
            Swal.fire('Error', 'La contraseña debe tener al menos 4 caracteres.', 'warning'); return;
        }
        const emailRegex = /(@duoc.cl|@profesor.duoc.cl|@gmail.com)$/;
        if (!emailRegex.test(formData.correo)) {
            Swal.fire('Correo inválido', 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com', 'warning'); return;
        }

        // 2. DETECCIÓN DE BENEFICIOS (Visual)
        let mensajes = [];
        if (formData.correo.endsWith('@duoc.cl') || formData.correo.endsWith('@profesor.duoc.cl')) mensajes.push('🎓 Descuento Duoc detectado');
        if (calcularEdad(formData.fechaNacimiento) >= 50) mensajes.push('🎂 Descuento por edad (50%) detectado');
        if (formData.codigoDescuento?.toUpperCase() === 'FELICES50') mensajes.push('🏷️ Código FELICES50 canjeado');

        setLoading(true);

        try {
            // PASO A: REGISTRAR EL USUARIO
            const usuarioParaBackend = {
                nombreCompleto: formData.nombreCompleto,
                correo: formData.correo,
                contrasena: formData.contrasena,
                rol: 'CLIENTE',
                telefono: formData.telefono,
                idRegion: parseInt(formData.idRegion),
                idComuna: parseInt(formData.idComuna),
                fechaNacimiento: formData.fechaNacimiento
            };

            // Llamada al endpoint de Registro
            await axios.post(REGISTER_API_URL, usuarioParaBackend);

            // PASO B: INICIAR SESIÓN AUTOMÁTICAMENTE
            // Usamos las mismas credenciales que el usuario acaba de escribir
            const loginResponse = await axios.post(LOGIN_API_URL, {
                correo: formData.correo,
                contrasena: formData.contrasena
            });

            // PASO C: GUARDAR SESIÓN (Igual que en IniciarSesion.jsx)
            const data = loginResponse.data;
            const usuarioSesion = {
                idUsuario: data.idUsuario,
                nombreCompleto: data.nombre,
                correo: formData.correo,
                rol: data.rol,
                token: data.token
            };
            sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioSesion));
            window.dispatchEvent(new Event('storageChange')); // Actualiza el Header

            // PASO D: ALERTA DE ÉXITO
            let titulo = `¡Bienvenido, ${data.nombre.split(' ')[0]}!`;
            let cuerpoMensaje = 'Tu cuenta ha sido creada con exito.';

            if (mensajes.length > 0) {
                cuerpoMensaje += '<br><br><strong>Beneficios activados:</strong><br>' + mensajes.join('<br>');
            }

            Swal.fire({
                title: titulo,
                html: cuerpoMensaje,
                icon: 'success',
                timer: 3000, // Un poquito más largo para leer los beneficios
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                // REDIRECCIÓN AL HOME (Porque es un usuario nuevo cliente)
                navigate('/');
            });

        } catch (error) {
            console.error("Error en registro/login:", error);
            let mensajeError = 'Hubo un problema al procesar tu solicitud.';
            
            if (error.response && error.response.data) {
                // Puede ser error de registro (correo duplicado) o de login
                mensajeError = error.response.data;
            }
            Swal.fire('Ups...', String(mensajeError), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <section className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card p-4 shadow-sm border-0">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <img src={LOGO_PATH} alt="Logo" style={{ width: '80px', marginBottom: '10px' }} />
                                <h2 className="card-title">Registro de usuario</h2>
                            </div>
                            
                            <form id="registro-form" onSubmit={handleSubmit} className="row g-3">
                                {/* ... MISMOS CAMPOS QUE ANTES ... */}
                                <div className="col-md-12">
                                    <label htmlFor="nombreCompleto" className="form-label">NOMBRE COMPLETO</label>
                                    <input type="text" className="form-control" id="nombreCompleto" required value={formData.nombreCompleto} onChange={handleChange} />
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="correo" className="form-label">CORREO</label>
                                    <input type="email" className="form-control" id="correo" required placeholder="ejemplo@gmail.com" value={formData.correo} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="contrasena" className="form-label">CONTRASEÑA</label>
                                    <input type="password" className="form-control" id="contrasena" required value={formData.contrasena} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="confirmarContrasena" className="form-label">CONFIRMAR CONTRASEÑA</label>
                                    <input type="password" className="form-control" id="confirmarContrasena" required value={formData.confirmarContrasena} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="fechaNacimiento" className="form-label">FECHA DE NACIMIENTO</label>
                                    <input type="date" className="form-control" id="fechaNacimiento" required value={formData.fechaNacimiento} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="telefono" className="form-label">TELÉFONO (opcional)</label>
                                    <input type="tel" className="form-control" id="telefono" value={formData.telefono} onChange={handleChange} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="idRegion" className="form-label">REGIÓN</label>
                                    <select className="form-select" id="idRegion" required value={formData.idRegion} onChange={handleChange}>
                                        <option disabled value="">- Seleccione -</option>
                                        {datosGeograficos.map(reg => <option key={reg.id} value={reg.id}>{reg.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="idComuna" className="form-label">COMUNA</label>
                                    <select className="form-select" id="idComuna" required value={formData.idComuna} onChange={handleChange} disabled={!formData.idRegion}>
                                        <option disabled value="">- Seleccione -</option>
                                        {comunasDisponibles.map(com => <option key={com.id} value={com.id}>{com.nombre}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="codigoDescuento" className="form-label">CÓDIGO DE DESCUENTO (opcional)</label>
                                    <input type="text" className="form-control" id="codigoDescuento" value={formData.codigoDescuento} onChange={handleChange} />
                                </div>
                                
                                <div className="col-12 text-center mt-4">
                                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                                        {loading ? 'CREANDO CUENTA...' : 'REGISTRARSE Y ENTRAR'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RegistroUsuario;