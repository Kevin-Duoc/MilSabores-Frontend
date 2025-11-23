import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ producto }) => {
    const imagePath = `/images/${producto.urlImagen}`;
    const productUrl = `/productos/${producto.idProducto}`;

    return (
        <div className="col-md-3 mb-4">
            <div className="card">
                <div className="card-img-container">
                    <img 
                        src={imagePath} 
                        className="card-img-top" 
                        alt={producto.nombre} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen'; }}
                    />
                </div>
                <div className="card-body text-center">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">
                        <strong>${producto.precio?.toLocaleString('es-CL')}</strong>
                    </p>
                    <Link to={productUrl} className="btn btn-primary">Ver detalle</Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;