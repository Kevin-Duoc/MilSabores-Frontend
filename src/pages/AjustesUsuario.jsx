import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// 1. IMPORTAR CONFIGURACIÓN
import { API_URLS } from '../config/api';

const AjustesUsuario = () => {
    const navigate = useNavigate();
    
    // URL para actualizar (Asumiremos este endpoint en el backend)
    const UPDATE_API_URL = `${API_URLS.AUTH}/actualizar`;

    // Datos geográficos (Los mismos del registro para consistencia)
    const datosGeograficos = [
        { id: 1, nombre: 'Metropolitana', comunas: [ {id:1,nombre:'Santiago'}, {id:2,nombre:'Providencia'}, {id:3,nombre:'Las Condes'}, {id:4,nombre:'Maipú'} ] },
        { id: 2, nombre: 'Valparaíso', comunas: [ {id:5,nombre:'Valparaíso'}, {id:6,nombre:'Viña del Mar'}, {id:7,nombre:'Quilpué'}, {id:8,nombre:'Villa Alemana'} ] },
        { id: 3, nombre: 'Biobío', comunas: [ {id:9,nombre:'Concepción'}, {id:10,nombre:'Talcahuano'}, {id:11,nombre:'San Pedro de la Paz'}, {id:12,nombre:'Chiguayante'} ] },
        { id: 4, nombre: 'Coquimbo', comunas: [ {id:13,nombre:'La Serena'}, {id:14,nombre:'Coquimbo'}, {id:15,nombre:'Ovalle'}, {id:16,nombre:'Illapel'} ] }
    ];

    const [formData, setFormData] = useState({
        idUsuario: null, // Necesitamos el ID para decirle al backend a quién actualizar
        nombreCompleto: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        fechaNacimiento: '',
        telefono: '',
        idRegion: '',
        idComuna: ''
    });
    
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    // 2. Cargar datos iniciales
    useEffect(() => {
        const usuario = JSON.parse(sessionStorage.getItem('usuarioActual'));
        
        if (!usuario) {
            Swal.fire('Error', 'Debes iniciar sesión para ver tus ajustes.', 'error')
                .then(() => navigate('/iniciar-sesion'));
            return;
        }

        // Rellenamos el formulario con lo que tenemos en sesión
        // (Idealmente aquí haríamos un GET al backend para tener datos frescos, pero por tiempo usamos sesión)
        setFormData({
            idUsuario: usuario.idUsuario,
            nombreCompleto: usuario.nombreCompleto || '',
            correo: usuario.correo || '',
            contrasena: '', // Por seguridad, no precargamos la contraseña
            confirmarContrasena: '',
            fechaNacimiento: usuario.fechaNacimiento || '', // Ojo: Si el login no devuelve esto, estará vacío
            telefono: usuario.telefono || '',
            idRegion: usuario.idRegion || '',
            idComuna: usuario.idComuna || ''
        });

        // Cargar comunas si hay región
        if (usuario.idRegion) {
            const reg = datosGeograficos.find(r => r.id === parseInt(usuario.idRegion));
            setComunasDisponibles(reg ? reg.comunas : []);
        }

        setIsLoaded(true);
    }, [navigate]);

    // 3. Manejo de cambios
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        if (id === 'idRegion') {
            const reg = datosGeograficos.find(r => r.id === parseInt(value));
            setComunasDisponibles(reg ? reg.comunas : []);
            setFormData(prev => ({ ...prev, [id]: value, idComuna: '' }));
        }
    };

    // 4. Enviar actualización a AWS
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
            Swal.fire('Error', 'Las contraseñas no coinciden.', 'warning');
            return;
        }
        if (formData.contrasena && (formData.contrasena.length < 4 || formData.contrasena.length > 10)) {
            Swal.fire('Error', 'La contraseña debe tener entre 4 y 10 caracteres.', 'warning');
            return;
        }

        setLoading(true);

        try {
            // Preparamos el DTO para el backend
            // Solo enviamos lo que cambió o es necesario
            const usuarioUpdateDto = {
                idUsuario: formData.idUsuario,
                nombreCompleto: formData.nombreCompleto,
                telefono: formData.telefono,
                idRegion: parseInt(formData.idRegion),
                idComuna: parseInt(formData.idComuna),
                fechaNacimiento: formData.fechaNacimiento
            };

            // Solo enviamos contraseña si el usuario escribió una nueva
            if (formData.contrasena) {
                usuarioUpdateDto.contrasena = formData.contrasena;
            }

            // PETICIÓN PUT AL BACKEND
            const response = await axios.put(UPDATE_API_URL, usuarioUpdateDto);

            // Actualizamos la sesión local con los nuevos datos para que no se pierdan al recargar
            const usuarioActualizado = {
                ...JSON.parse(sessionStorage.getItem('usuarioActual')),
                nombreCompleto: formData.nombreCompleto,
                // ... otros campos que quieras actualizar en sesión ...
            };
            sessionStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
            window.dispatchEvent(new Event('storageChange'));

            Swal.fire('¡Listo!', 'Tus datos han sido actualizados.', 'success')
                .then(() => navigate('/'));

        } catch (error) {
            console.error("Error actualizando:", error);
            Swal.fire('Error', 'No se pudieron actualizar los datos en el servidor.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) return <div className="text-center my-5"><div className="spinner-border"></div></div>;

    return (
        <div className="container my-5">
            <section className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card p-4 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Actualizar Datos</h2>
                            
                            <form id="ajustes-form" className="row g-3" onSubmit={handleSubmit}>
                                
                                <div className="col-md-12">
                                    <label htmlFor="nombreCompleto" className="form-label">NOMBRE COMPLETO</label>
                                    <input type="text" className="form-control" id="nombreCompleto" required 
                                           value={formData.nombreCompleto} onChange={handleChange} />
                                </div>
                                
                                <div className="col-md-12">
                                    <label htmlFor="correo" className="form-label">CORREO (No editable)</label>
                                    <input type="email" className="form-control" id="correo" disabled 
                                           value={formData.correo} />
                                </div>
                                
                                <div className="col-md-6">
                                    <label htmlFor="contrasena" className="form-label">NUEVA CONTRASEÑA (Opcional)</label>
                                    <input type="password" className="form-control" id="contrasena" 
                                           placeholder="Dejar en blanco para mantener"
                                           value={formData.contrasena} onChange={handleChange} />
                                </div>
                                
                                <div className="col-md-6">
                                    <label htmlFor="confirmarContrasena" className="form-label">CONFIRMAR NUEVA CONTRASEÑA</label>
                                    <input type="password" className="form-control" id="confirmarContrasena" 
                                           placeholder="Repetir nueva contraseña"
                                           value={formData.confirmarContrasena} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="fechaNacimiento" className="form-label">FECHA NACIMIENTO</label>
                                    <input type="date" className="form-control" id="fechaNacimiento"
                                           value={formData.fechaNacimiento} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="telefono" className="form-label">TELÉFONO</label>
                                    <input type="tel" className="form-control" id="telefono"
                                           value={formData.telefono} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="idRegion" className="form-label">REGIÓN</label>
                                    <select className="form-select" id="idRegion" value={formData.idRegion} onChange={handleChange}>
                                        <option disabled value="">- Seleccione -</option>
                                        {datosGeograficos.map(reg => <option key={reg.id} value={reg.id}>{reg.nombre}</option>)}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="idComuna" className="form-label">COMUNA</label>
                                    <select className="form-select" id="idComuna" value={formData.idComuna} onChange={handleChange} disabled={!formData.idRegion}>
                                        <option disabled value="">- Seleccione -</option>
                                        {comunasDisponibles.map(com => <option key={com.id} value={com.id}>{com.nombre}</option>)}
                                    </select>
                                </div>
                                
                                <div className="col-12 text-center mt-4">
                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
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

export default AjustesUsuario;