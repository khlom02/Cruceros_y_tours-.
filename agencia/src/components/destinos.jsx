import { Banner } from "./Banner";
import { CardGrid } from "./CardGrid";
import "../styles/grid_experiencias.css";

export const Destinos = () => {
  return (
    <div className="experiencias-container">
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