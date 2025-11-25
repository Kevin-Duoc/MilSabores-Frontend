import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Contacto = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false); // Para el efecto de "Enviando..."
    
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        comentario: ''
    });

    // 1. Cargar datos si el usuario ya existe (¡Esto lo rescatamos!)
    useEffect(() => {
        const usuarioActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
        
        if (usuarioActual) {
            setUsuario(usuarioActual);
            setFormData(prev => ({
                ...prev,
                nombre: usuarioActual.nombreCompleto || '',
                correo: usuarioActual.correo || ''
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 2. Validaciones (Las mismas que tenías, pero con Swal)
        if (!usuario) {
            // Opción: ¿Obligar a loguearse o dejar que cualquiera envíe?
            // Tu código original obligaba. Mantenemos esa lógica si quieres, 
            // o la quitamos para que sea más abierto. Aquí la dejo como advertencia.
            Swal.fire({
                title: 'Atención',
                text: 'Para agilizar tu atención, te recomendamos iniciar sesión.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Ir al Login',
                cancelButtonText: 'Continuar como invitado'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/iniciar-sesion');
                } else {
                    // Si sigue como invitado, procesamos (lógica recursiva o continuar aquí)
                    procesarEnvio();
                }
            });
            return;
        }

        procesarEnvio();
    };

    const procesarEnvio = () => {
        // Validaciones de campos
        if (formData.nombre.length > 100) return Swal.fire('Error', 'El nombre es muy largo.', 'warning');
        if (formData.correo.length > 100) return Swal.fire('Error', 'El correo es muy largo.', 'warning');
        
        const emailRegex = /(@duoc.cl|@profesor.duoc.cl|@gmail.com)$/;
        if (!emailRegex.test(formData.correo)) {
            return Swal.fire('Error', 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com', 'warning');
        }
        
        if (formData.comentario.length > 500) return Swal.fire('Error', 'El comentario no puede exceder los 500 caracteres.', 'warning');

        // 3. SIMULACIÓN DE ENVÍO (Sin tocar Backend)
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            
            Swal.fire({
                title: '¡Mensaje Enviado!',
                text: 'Hemos recibido tus comentarios. Te contactaremos a la brevedad.',
                icon: 'success',
                confirmButtonColor: '#d63384' // Color "Pastelería"
            });

            // Limpiar solo el comentario (mantener datos de usuario si está logueado)
            setFormData(prev => ({
                ...prev,
                comentario: ''
            }));
            
            // Si no estaba logueado, limpiamos todo
            if (!usuario) {
                setFormData({ nombre: '', correo: '', comentario: '' });
            }

        }, 2000); // 2 segundos de "espera falsa"
    };

    return (
        <div className="container my-5">
            <section className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card p-4 shadow border-0">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4 section-title">FORMULARIO DE CONTACTO</h2>
                            
                            <form id="contacto-form" onSubmit={handleSubmit} className="row g-3">
                                
                                {/* Si está logueado, mostramos un saludo en vez de los inputs bloqueados (Mejor UX) */}
                                {usuario ? (
                                    <div className="col-12">
                                        <div className="alert alert-light border text-center">
                                            Enviando mensaje como: <strong>{usuario.nombreCompleto}</strong> ({usuario.correo})
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="col-md-12">
                                            <label htmlFor="nombre" className="form-label">Nombre</label>
                                            <input type="text" className="form-control" id="nombre" required 
                                                   value={formData.nombre} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="correo" className="form-label">Correo</label>
                                            <input type="email" className="form-control" id="correo" required 
                                                   value={formData.correo} onChange={handleChange} />
                                        </div>
                                    </>
                                )}

                                <div className="col-md-12">
                                    <label htmlFor="comentario" className="form-label">Comentario</label>
                                    <textarea className="form-control" id="comentario" rows="5" required 
                                              placeholder="Escribe tu consulta, sugerencia o reclamo aquí..."
                                              value={formData.comentario} onChange={handleChange}></textarea>
                                </div>
                                
                                <div className="col-12 text-center mt-4">
                                    <button type="submit" className="btn btn-primary w-50 py-2" disabled={loading}>
                                        {loading ? (
                                            <span><i className="spinner-border spinner-border-sm me-2"></i> Enviando...</span>
                                        ) : 'ENVIAR MENSAJE'}
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

export default Contacto;