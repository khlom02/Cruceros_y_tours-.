import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "../styles/aerolineas.css";
import { getSupabaseImageUrl } from "../utils/imageHelper";

const defaultLogo = getSupabaseImageUrl("imagenes/tap_air.png");

const resolveLogo = (logo) => {
  if (!logo || !logo.trim()) return defaultLogo;
  return logo;
};

const getLogoStyle = (airline) => ({
  objectFit: airline.logoFit || "cover",
  transform: `scale(${airline.logoScale ?? 1})`,
});

const airlines = [
  { id: "tap", nombre: "Tap Air Portugal", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/tap_air.png"), logoFit: "contain", logoScale: 1 },
  { id: "copa", nombre: "Copa Airlines", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/copa_airlines.jpg"), logoFit: "cover", logoScale: 1.1 },
  { id: "turpial", nombre: "Turpial Airlines", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/turpial.png"), logoFit: "contain", logoScale: 1.5 },
  { id: "iberia", nombre: "Iberia", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/iberia.png"), logoFit: "contain", logoScale: 1.5 },
  { id: "air-europa", nombre: "Air Europa", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/air_europa.png"), logoFit: "contain", logoScale: 3 },
  { id: "latam", nombre: "Latam Airlines", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/latam.png"), logoFit: "contain", logoScale: 1 },
  { id: "avior", nombre: "Avior Airlines", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/avior.jpg"), logoFit: "cover", logoScale: 1 },
  { id: "aeropostal", nombre: "Aeropostal", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/aeropostal.png"), logoFit: "contain", logoScale: 1.5 },
  { id: "aerocaribe", nombre: "Aerocaribe", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/aerocaribe.png"), logoFit: "contain", logoScale: 1 },
  { id: "venezolana", nombre: "Venezolana de Aviación", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/venezolana.png"), logoFit: "contain", logoScale: 1 },
  { id: "rutaca", nombre: "Rutaca Airlines", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/rutaca.jpeg"), logoFit: "cover", logoScale: 1 },
  { id: "turkish", nombre: "Turkish Airlines", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/Turkish.png"), logoFit: "contain", logoScale: 1 },
  { id: "american", nombre: "American Airlines", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/American_Airlines.png"), logoFit: "contain", logoScale: 2 },
  { id: "estelar", nombre: "Estelar Latinoamérica", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/estelar.jpeg"), logoFit: "cover", logoScale: 1 },
  { id: "plus-ultra", nombre: "Plus Ultra Líneas Aéreas", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/Plus_Ultra.png"), logoFit: "contain", logoScale: 1 },
  { id: "conviasa", nombre: "Conviasa", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/conviasa.png"), logoFit: "contain", logoScale: 1 },
  { id: "gol", nombre: "Gol Airlines", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/gol.png"), logoFit: "contain", logoScale: 1 },
  { id: "bolivariana", nombre: "Bolivariana de Aviación", tarifa: "Tarifas Comisionables al 6% en rutas nacionales y 3% en rutas internacionales. Comisiona 50%", logo: getSupabaseImageUrl("imagenes/Bolivariana.png"), logoFit: "contain", logoScale: 1.5 },
];

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Aerolíneas disponibles - Cruceros y Tours",
  "description": "Lista de aerolíneas con tarifas comisionables para vuelos nacionales e internacionales.",
  "numberOfItems": airlines.length,
  "itemListElement": airlines.map((a, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "item": {
      "@type": "Airline",
      "name": a.nombre,
      "description": a.tarifa,
      "url": `https://cruceros-y-tours.vercel.app/vuelos?aerolinea=${a.id}`,
    },
  })),
};

const Aerolineas = () => (
  <>
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(itemListJsonLd)}
      </script>
    </Helmet>
    <div className="aerolineas-container">
      <div className="aerolineas-content">
        {airlines.map((airline) => (
          <Link
            key={airline.id}
            to={`/vuelos?aerolinea=${airline.id}`}
            className="airline-card-link"
          >
            <img
              className="airline-card-logo"
              src={resolveLogo(airline.logo)}
              style={getLogoStyle(airline)}
              alt={`Logo ${airline.nombre}`}
              loading="lazy"
              decoding="async"
            />
            <span className="airline-card-name">{airline.nombre}</span>
            <p className="airline-card-tarifa">{airline.tarifa}</p>
          </Link>
        ))}
      </div>
    </div>
  </>
);

export default Aerolineas;
