import { Banner } from "./Banner";
import { CardGrid } from "./CardGrid";
import "../styles/grid_experiencias.css";
import SEO from './SEO.jsx';

const Vuelos = () => {
  return (
    <div className="experiencias-container">
      <SEO
        title="Vuelos Internacionales"
        description="Encuentra los mejores vuelos con las mejores aerolíneas del mundo. Compara precios y rutas para volar hacia tu destino ideal."
        canonical="/vuelos"
      />
      <Banner
        titulo="Vuela Hacia tu Destino"
        subtitulo="Encuentra los mejores vuelos con las mejores aerolíneas del mundo."
        colorFondo="#1F3A5F"
      />
      <CardGrid 
        categoryName="Vuelos" 
        cardRootClassName="grid-experiencia__card"
        cardBaseClassName="grid-experiencia"
        detalleTipo="vuelo"
      />
    </div>
  );
};

export default Vuelos;