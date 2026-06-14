import "../styles/mobileStickyBar.css";

const MobileStickyBar = ({ detalle }) => {
  const waText = `Hola, quiero información sobre el paquete: ${encodeURIComponent(detalle.title)}`;

  const scrollToReserva = () => {
    const el = document.getElementById("seccion-reserva");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mobile-sticky-bar">
      <a
        href={`https://wa.me/584142783669?text=${waText}`}
        className="mobile-sticky-bar__btn mobile-sticky-bar__btn--wa"
        target="_blank"
        rel="noopener noreferrer"
      >
        💬 WhatsApp
      </a>
      <button
        type="button"
        className="mobile-sticky-bar__btn mobile-sticky-bar__btn--cta"
        onClick={scrollToReserva}
      >
        Solicitar información
      </button>
    </div>
  );
};

export default MobileStickyBar;
