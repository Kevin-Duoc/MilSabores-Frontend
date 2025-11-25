import React from 'react';
import { Link } from 'react-router-dom';

export const listaBlogs = [
    {
        id: 1,
        titulo: "Tus Sueños Hechos Torta",
        img: "/images/tortapochita.jpg",
        contenido: (
            <>
                <h3>¡Transformamos tu idea en el pastel perfecto!</h3>
                <p>
                    Una celebración especial merece una torta inolvidable. En Pastelería 1000 Sabores, creemos que cada pastel debe ser tan único como la persona que lo festeja. Por eso, nos especializamos en crear tortas personalizadas que no solo son deliciosas, sino que también cuentan una historia: <strong>la tuya</strong>.
                </p>
                
                <h4>De la Imaginación al Paladar</h4>
                <p>
                    Todo comienza con tu visión. ¿Tienes en mente el personaje favorito de tu hijo, los colores de tu boda o un diseño completamente original? ¡Cuéntanoslo! Nuestro equipo trabajará contigo para hacerlo realidad.
                </p>
                
                <h4>Sabor y Calidad en Cada Bocado</h4>
                <p>
                    Utilizamos solo ingredientes frescos y de la más alta calidad. Puedes elegir entre una gran variedad de sabores para el bizcocho, rellenos cremosos y cubiertas que se derriten en tu boca.
                </p>

                <h4>Perfectas para Cualquier Ocasión</h4>
                <ul>
                    <li>Cumpleaños infantiles y de adultos</li>
                    <li>Bodas y aniversarios</li>
                    <li>Eventos corporativos</li>
                </ul>
                
                <div className="alert alert-light border mt-4 text-center">
                    <h4>¿Listo para crear la torta de tus sueños?</h4>
                    <p>No esperes más. Visita nuestra sección de <Link to="/contacto"><strong>Contacto</strong></Link> y cuéntanos tu idea.</p>
                </div>
            </>
        )
    },
    {
        id: 2,
        titulo: "Un Momento para tu Paladar: Gran Degustación Gratuita",
        img: "/images/evento.jpg",
        contenido: (
            <>
                <h3>¡Una Oportunidad Única para Endulzar tu Paladar!</h3>
                <p>
                    En Pastelería 1000 Sabores estamos increíblemente emocionados. Hemos organizado nuestro primer <strong>Día de Degustación Gratuita</strong>, una jornada especial dedicada a que conozcas de primera mano los sabores que nos hacen únicos.
                </p>

                <h4>¿Qué Podrás Probar?</h4>
                <ul>
                    <li>Mini porciones de nuestras tortas estrella: Tres Leches, Selva Negra y Manjar-Lúcuma.</li>
                    <li>Cupcakes de Red Velvet y Vainilla con frosting de queso crema.</li>
                    <li>Nuestras famosas galletas de mantequilla decoradas.</li>
                    <li><strong>¡Y el debut de un nuevo sabor secreto!</strong></li>
                </ul>

                <h4>La Cita: ¿Cuándo y Dónde?</h4>
                <p>
                    El evento se realizará este próximo <strong>miércoles 22 de Octubre</strong>. Estaremos esperándote en la <strong>sala LC4 de Duoc UC</strong>.
                </p>

                <div className="alert alert-warning text-center mt-4">
                    <h4>¡No Faltes a la Cita Más Dulce!</h4>
                    <p>No necesitas inscripción, ¡solo tu presencia! Te recomendamos llegar temprano ya que los cupos son limitados.</p>
                </div>
            </>
        )
    }
];