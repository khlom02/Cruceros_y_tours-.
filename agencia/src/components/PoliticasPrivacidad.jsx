import React from "react";
import '../styles/info-pages.css';

const PoliticasPrivacidad = () => {
  return (
    <main className="info-page">
      <div className="info-page__container">
        <h1 className="info-page__title">Políticas de Privacidad</h1>
        <p className="info-page__subtitle">Última actualización: abril 2025</p>

        <div className="policy-section">
          <h2>1. Información que recopilamos</h2>
          <p>
            Recopilamos información que usted nos proporciona directamente al registrarse, realizar reservas o contactarnos:
            nombre, correo electrónico, teléfono e información de pago. También recopilamos datos de uso de la plataforma
            de forma anónima para mejorar nuestros servicios.
          </p>
        </div>

        <div className="policy-section">
          <h2>2. Uso de la información</h2>
          <p>
            Utilizamos su información para procesar reservas, enviar confirmaciones, brindar soporte al cliente y,
            con su consentimiento, enviar comunicaciones sobre ofertas y novedades. No vendemos ni compartimos
            sus datos con terceros sin su autorización, salvo lo requerido por ley.
          </p>
        </div>

        <div className="policy-section">
          <h2>3. Almacenamiento y seguridad</h2>
          <p>
            Sus datos se almacenan en servidores seguros mediante Supabase, con cifrado en tránsito (TLS) y
            en reposo. Aplicamos medidas técnicas y organizativas para proteger su información contra
            acceso no autorizado, pérdida o destrucción.
          </p>
        </div>

        <div className="policy-section">
          <h2>4. Cookies</h2>
          <p>
            Usamos cookies esenciales para el funcionamiento de la plataforma (sesión de usuario) y cookies
            analíticas anónimas para entender cómo se usa el sitio. Puede desactivar las cookies analíticas
            desde la configuración de su navegador sin afectar la funcionalidad principal.
          </p>
        </div>

        <div className="policy-section">
          <h2>5. Sus derechos</h2>
          <p>
            Tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento.
            Para ejercer estos derechos, escríbanos a través de nuestra página de{" "}
            <a href="/contacto">Contacto</a>.
          </p>
        </div>

        <div className="policy-section">
          <h2>6. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política periódicamente. Le notificaremos cualquier cambio significativo
            por email o mediante un aviso destacado en el sitio.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PoliticasPrivacidad;
