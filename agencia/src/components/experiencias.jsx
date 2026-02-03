import React from "react";
import '../styles/experiencias.css';
import { BannerExperiencias } from "./banner_experiencias";
import { CardExperiencias, GridExperiencias } from "./grid_experiencias";

export const Experiencias = () => {

  return (
    <div className="experiencias-container">
      <BannerExperiencias />

      <GridExperiencias />
    </div>
  );
};