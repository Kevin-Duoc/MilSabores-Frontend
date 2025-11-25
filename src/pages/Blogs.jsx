import React from 'react';
import { Link } from 'react-router-dom';
import { listaBlogs } from '../data/blogData';

const Blogs = () => {
    return (
        <div className="container my-5">
            <h1 className="text-center mb-5 section-title">NOTICIAS IMPORTANTES</h1>
            
            <section className="row">
                {listaBlogs.map(blog => (
                    // CAMBIO: col-md-6 permite que entren 2 por fila. h-100 iguala las alturas.
                    <div className="col-md-6 mb-4" key={blog.id}>
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-img-container" style={{height: '250px', overflow: 'hidden'}}>
                                <img 
                                    src={blog.img} 
                                    alt={blog.titulo} 
                                    className="card-img-top" 
                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                    onError={(e) => e.target.src = '/images/logo_empresa.png'} 
                                />
                            </div>
                            <div className="card-body d-flex flex-column">
                                <h3 className="card-title text-primary h4">{blog.titulo}</h3>
                                <p className="card-text text-muted flex-grow-1">
                                    Haz clic para leer la noticia completa y enterarte de todos los detalles sobre este evento.
                                </p>
                                
                                {/* El enlace debe coincidir con la ruta en App.jsx */}
                                <Link to={`/blogs/detalle/${blog.id}`} className="btn btn-outline-primary mt-3">
                                    Leer más
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Blogs;