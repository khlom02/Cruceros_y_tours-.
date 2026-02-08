import React from "react";
import "../styles/detalles_navieras.css";

const DetallesNavieras = ({
    anosServicio,
    pasajerosMax,
    tripulantes,
    ratioEspacio,
    ratioServicio,
    cabinaSingle,
    viajandoConNinos,
}) => {
    return (
        <section className="detalles-navieras">
            <div className="detalles-navieras__row">
                <div className="detalles-navieras__item">
                    <span className="detalles-navieras__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="img">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                        </svg>
                    </span>
                    <span className="detalles-navieras__value">{anosServicio}</span>
                    <span className="detalles-navieras__label">anos en servicio</span>
                </div>
                <div className="detalles-navieras__item">
                    <span className="detalles-navieras__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="img">
                            <circle cx="8" cy="10" r="3" />
                            <circle cx="16" cy="10" r="3" />
                            <path d="M3 20c1-3 4-4 5-4" />
                            <path d="M21 20c-1-3-4-4-5-4" />
                        </svg>
                    </span>
                    <span className="detalles-navieras__value">{pasajerosMax}</span>
                    <span className="detalles-navieras__label">pasajeros max.</span>
                </div>
                <div className="detalles-navieras__item">
                    <span className="detalles-navieras__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="img">
                            <circle cx="12" cy="9" r="3" />
                            <path d="M5 20c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" />
                        </svg>
                    </span>
                    <span className="detalles-navieras__value">{tripulantes}</span>
                    <span className="detalles-navieras__label">tripulantes</span>
                </div>
            </div>

            <div className="detalles-navieras__row">
                <div className="detalles-navieras__item">
                    <span className="detalles-navieras__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="img">
                            <path d="M4 12h16" />
                            <path d="M4 6h16" />
                            <path d="M4 18h16" />
                        </svg>
                    </span>
                    <span className="detalles-navieras__label">Ratio espacio:</span>
                    <span className="detalles-navieras__value">{ratioEspacio}</span>
                </div>
                <div className="detalles-navieras__item">
                    <span className="detalles-navieras__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="img">
                            <path d="M12 4l2.5 5 5.5.8-4 3.9.9 5.5L12 16l-4.9 2.2.9-5.5-4-3.9 5.5-.8z" />
                        </svg>
                    </span>
                    <span className="detalles-navieras__label">Ratio servicio:</span>
                    <span className="detalles-navieras__value">{ratioServicio}</span>
                </div>
            </div>

            <div className="detalles-navieras__row">
                {cabinaSingle && (
                    <div className="detalles-navieras__item">
                        <span className="detalles-navieras__icon detalles-navieras__icon--ok" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="img">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M8 12l2.5 2.5L16 9" />
                            </svg>
                        </span>
                        <span className="detalles-navieras__label">Cabina Single</span>
                    </div>
                )}
                {viajandoConNinos && (
                    <div className="detalles-navieras__item">
                        <span className="detalles-navieras__icon detalles-navieras__icon--ok" aria-hidden="true">
                            <svg viewBox="0 0 24 24" role="img">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M8 12l2.5 2.5L16 9" />
                            </svg>
                        </span>
                        <span className="detalles-navieras__label">Viajando con ninos</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DetallesNavieras;
