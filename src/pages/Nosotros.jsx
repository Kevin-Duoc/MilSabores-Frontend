import React from 'react';
import { Link } from 'react-router-dom';

const Nosotros = () => {
    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Sobre Nosotros</h1>
            <section>
                <div className="row">
                    <div className="col-md-6">
                        <h3>Misión</h3>
                        <p>Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería.</p>
                    </div>
                    <div className="col-md-6">
                        <h3>Visión</h3>
                        <p>Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía.</p>
                    </div>
                </div>
                
                <div className="mt-5 text-center">
                    <h2 className="mb-5">El Equipo de Desarrollo</h2>
                    <div className="row">
                        <div className="col-lg-6 mb-4">
                            <img src="/images/generico_female.png" alt="Foto de Esther" className="rounded-circle mb-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            <h4>Esther Orellana</h4>
                            <p className="text-muted">Estudiante de Ingenieria en Informatica con mención en Desarrollo de Software</p>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <img src="/images/generico_male.png" alt="Foto de Kevin" className="rounded-circle mb-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            <h4>Kevin Fuenzalida</h4>
                            <p className="text-muted">Estudiante de Ingenieria en Informatica con mención en Inteligencia Artificial</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Nosotros;