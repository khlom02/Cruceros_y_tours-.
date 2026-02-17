import { Banner } from "./Banner";
import { CardGrid } from "./CardGrid";
import "../styles/card_cruceros.css";

const Cruceros = () => {
  return (
    <div className="experiencias-container">
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