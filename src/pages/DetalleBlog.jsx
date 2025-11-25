import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Importamos la data (Asegúrate que blogData.jsx exista en src/data/)
import { listaBlogs } from '../data/blogData';

const DetalleBlog = () => {
    const { id } = useParams(); // Esto captura el "1", "2", etc. de la URL
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        // Buscamos la noticia que coincida con el ID
        const blogEncontrado = listaBlogs.find(b => b.id === parseInt(id));
        setBlog(blogEncontrado);
    }, [id]);

    if (!blog) {
        return (
            <div className="container my-5 text-center">
                <h2 className="text-danger">Noticia no encontrada</h2>
                <Link to="/blogs" className="btn btn-outline-primary mt-3">Volver a Noticias</Link>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <Link to="/blogs" className="btn btn-secondary mb-4">← Volver</Link>
            
            <h1 className="text-center mb-4">{blog.titulo}</h1>
            
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="text-center mb-4">
                        <img 
                            src={blog.img} 
                            alt={blog.titulo} 
                            className="img-fluid rounded shadow" 
                            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                            onError={(e) => e.target.src = '/images/logo_empresa.png'}
                        />
                    </div>
                    
                    {/* Renderizamos el contenido HTML/JSX que guardamos en la data */}
                    <div className="blog-content">
                        {blog.contenido}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleBlog;