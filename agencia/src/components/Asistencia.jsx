import React from 'react';
import '../styles/asistencia.css';
import { getSupabaseImageUrl } from '../utils/imageHelper';

const Asistencia = () => {
    return (
        <div className="asistencia-container">
            <div className="imagen-izquierda">
                <img
                    src={getSupabaseImageUrl("imagenes/logo_interwelt.png")}
                    alt="INTERWELT"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className="imagen-centro">
                <img
                    src={getSupabaseImageUrl("imagenes/logo_simply.png")}
                    alt="SIMPLY ASSISTANCE"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className="imagen-derecha">
                <img
                    src={getSupabaseImageUrl("imagenes/logo_runaway.png")}
                    alt="RUNAWAY TRAVEL ASSISTANCE"
                    loading="lazy"
                    decoding="async"
                />
            </div>
        </div>
    );
}

export default Asistencia;