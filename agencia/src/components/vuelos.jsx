import { BannerVuelos } from "./banner_vuelos";
import { GridExperiencias } from "./grid_experiencias";

const Vuelos = () => {
  return (
    <div className="experiencias-container">
      <BannerVuelos />
      <GridExperiencias detalleTipo="vuelo" />
    </div>
  );
};

export default Vuelos;