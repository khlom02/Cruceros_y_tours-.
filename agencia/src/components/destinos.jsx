import { Banner } from "./Banner";
import { CardGrid } from "./CardGrid";
import "../styles/grid_experiencias.css";
import SEO from './SEO.jsx';

export const Destinos = () => {
  return (
    <div className="experiencias-container">
      <SEO
        title="Destinos de Viaje"
        description="Explora destinos increíbles alrededor del mundo. Experiencias únicas y personalizadas para cada viajero. Encuentra tu próximo destino ideal."
        canonical="/destinos"
      />
      <Banner
        titulo="Descubre Destinos Increíbles"
        subtitulo="Explora experiencias únicas y personalizadas alrededor del mundo."
        colorFondo="#2C5F4F"
      />
      <CardGrid 
        categoryName="Destinos" 
        cardRootClassName="grid-experiencia__card"
        cardBaseClassName="grid-experiencia"
      />
    </div>
  );
};