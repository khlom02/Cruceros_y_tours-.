import { useSearchParams } from "react-router-dom";
import { Banner } from "./Banner";
import { CardGrid } from "./CardGrid";
import "../styles/card_cruceros.css";
import SEO from './SEO.jsx';

const Vuelos = () => {
  const [searchParams] = useSearchParams();
  const aerolinea = searchParams.get("aerolinea") || "";

  const aerolineasNombres = {
    tap: "Tap Air Portugal",
    copa: "Copa Airlines",
    turpial: "Turpial Airlines",
    iberia: "Iberia",
    "air-europa": "Air Europa",
    latam: "Latam Airlines",
    avior: "Avior Airlines",
    aeropostal: "Aeropostal",
    aerocaribe: "Aerocaribe",
    venezolana: "Venezolana de Aviación",
    rutaca: "Rutaca Airlines",
    turkish: "Turkish Airlines",
    american: "American Airlines",
    estelar: "Estelar Latinoamérica",
    "plus-ultra": "Plus Ultra Líneas Aéreas",
    conviasa: "Conviasa",
    gol: "Gol Airlines",
    bolivariana: "Bolivariana de Aviación",
  };

  const aerolineaNombre = aerolineasNombres[aerolinea] || "";
  const descVuelos = aerolineaNombre
    ? `Encuentra los mejores vuelos con ${aerolineaNombre}. Compara precios y rutas para volar hacia tu destino ideal.`
    : "Encuentra los mejores vuelos con las mejores aerolíneas del mundo. Compara precios y rutas para volar hacia tu destino ideal.";

  return (
    <div className="experiencias-container">
      <SEO
        title={aerolineaNombre ? `Vuelos ${aerolineaNombre}` : "Vuelos Internacionales"}
        description={descVuelos}
        canonical="/vuelos"
      />
      <Banner
        titulo={aerolineaNombre ? `Vuela con ${aerolineaNombre}` : "Vuela Hacia tu Destino"}
        subtitulo={descVuelos}
        colorFondo="#1F3A5F"
      />
      <CardGrid 
        categoryName="Vuelos" 
        cardRootClassName="grid-experiencia__card"
        cardBaseClassName="grid-experiencia"
        detalleTipo="vuelo"
        airlineFilter={aerolineaNombre}
      />
    </div>
  );
};

export default Vuelos;