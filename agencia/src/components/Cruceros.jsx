import { Banner } from "./Banner";
import { CardGrid } from "./CardGrid";
import "../styles/card_cruceros.css";
import SEO from './SEO.jsx';

const Cruceros = () => {
  return (
    <div className="experiencias-container">
      <SEO
        title="Cruceros de Lujo"
        description="Navega por los destinos más hermosos del mundo a bordo de nuestros cruceros de lujo. Caribe, Mediterráneo, Fiordos y más. Reserva tu crucero ideal."
        canonical="/cruceros"
      />
      <Banner
        titulo="Cruceros de Lujo"
        subtitulo="Navega por los destinos más hermosos del mundo a bordo de nuestros cruceros."
        colorFondo="#8B4513"
      />
      <CardGrid 
        categoryName="Cruceros" 
        cardRootClassName="card_cruceros"
        cardBaseClassName="card_cruceros"
        detalleTipo="crucero"
      />
    </div>
  );
};

export default Cruceros;