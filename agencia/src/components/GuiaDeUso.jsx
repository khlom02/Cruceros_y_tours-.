import React from "react";
import '../styles/info-pages.css';

const GuiaDeUso = () => {
  return (
    <main className="info-page">
      <div className="info-page__container">
        <h1 className="info-page__title">Guía de Uso</h1>
        <p className="info-page__subtitle">Aprende a sacarle el máximo provecho a nuestra plataforma.</p>

        <div className="guide-section">
          <h2>1. Explorar destinos</h2>
          <p>
            En el menú principal encontrarás las categorías disponibles: <strong>Cruceros</strong>, <strong>Vuelos</strong>,
            <strong> Destinos</strong> y <strong>Servicios Especiales</strong>. Haz clic en cualquiera para ver las opciones disponibles.
          </p>
        </div>

        <div className="guide-section">
          <h2>2. Ver detalles de un producto</h2>
          <p>
            Al seleccionar un destino o paquete, accederás a la página de detalles donde verás itinerario, precio, fechas disponibles y habitaciones incluidas.
          </p>
        </div>

        <div className="guide-section">
          <h2>3. Crear tu cuenta</h2>
          <ul>
            <li>Haz clic en <strong>Registro</strong> en la barra de navegación.</li>
            <li>Completa tu nombre, email y contraseña.</li>
            <li>Verifica tu correo electrónico para activar la cuenta.</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>4. Realizar una reserva</h2>
          <ul>
            <li>Selecciona el paquete de tu interés.</li>
            <li>Elige fecha y número de pasajeros.</li>
            <li>Ingresa los datos de pago y confirma.</li>
            <li>Recibirás un email de confirmación con todos los detalles.</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>5. Servicios Especiales</h2>
          <p>
            En la sección de Servicios Especiales encontrarás opciones de transporte terrestre (trenes y vehículos) y asistencia al viajero. Estos se pueden añadir como complemento a cualquier paquete.
          </p>
        </div>

        <div className="guide-section">
          <h2>6. Contactar un agente</h2>
          <p>
            Si tienes dudas en cualquier paso del proceso, usa el botón flotante <strong>"Habla con un agente"</strong> o visita nuestra página de <a href="/contacto">Contacto</a>.
          </p>
        </div>
      </div>
    </main>
  );
};

export default GuiaDeUso;
