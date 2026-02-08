import { BannerExperiencias } from "./banner_experiencias";
import { CardExperiencias, GridExperiencias } from "./grid_experiencias";

export const Destinos = () => {

  return (
    <div className="experiencias-container">
      <BannerExperiencias />

      <GridExperiencias />
    </div>
  );
};