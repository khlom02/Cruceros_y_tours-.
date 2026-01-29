import React from 'react';
import '../styles/asistencia.css';

const Asistencia = () => {
    return (
        <div className="asistencia-container">
            <div className="imagen-izquierda">
                <img src="/src/imagenes/costa.jpg" alt="Imagen izquierda" />
            </div>
            <div className="imagen-centro">
                <img src="/src/imagenes/costa.jpg" alt="Imagen centro" />
            </div>
            <div className="imagen-derecha">
                <img src="/src/imagenes/costa.jpg" alt="Imagen derecha" />
            </div>
        </div>
    );
}

export default Asistencia;