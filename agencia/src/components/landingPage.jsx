import 'animate.css';
import '../styles/landing.css';
import SEO from './SEO.jsx';
import '../styles/tours_cards.css';
import Carousel3D from './Carousel3D';
import Aerolineas from "./Aerolineas.jsx";
import Asistencia from "./Asistencia.jsx";
import { useState, useEffect } from 'react';
import { fetchCarouselCruises } from '../backend/supabase_client';
import { Link } from 'react-router-dom';
import Trenesyvehiculos from './Trenes_vehiculos.jsx';
import BannerPrincipal from './banner_principal.jsx';
import DestinosSection from './DestinosSection.jsx';
import Testimonios from './Testimonios.jsx';

const CAROUSEL_FALLBACK = [
  { id: 1, img: "/src/imagenes/MSC.jpg",       logo: "/src/assets/MSC_logo.png",            title: "Alaska" },
  { id: 2, img: "/src/imagenes/promo_royal.jpeg", logo: "/src/assets/royal_caribbean_logo.jpg", title: "Europa" },
  { id: 3, img: "/src/imagenes/serenade.mp4",   logo: "/src/assets/royal_caribbean_logo.jpg", title: "¡CRUCERO SIN VISA! (Hasta abril 2027)" },
  { id: 4, img: "/src/imagenes/celebrity.jpg",  logo: "/src/assets/Celebrity_logo.jpg",       title: "Caribe Familiar" },
  { id: 5, img: "/src/imagenes/costa.jpg",       logo: "/src/assets/costa_logo.png",           title: "Transatlánticos." },
];

const LandingPage = () => {
  const [carouselDestinations, setCarouselDestinations] = useState([]);

  useEffect(() => {
    fetchCarouselCruises(5).then((data) => {
      if (data.length > 0) setCarouselDestinations(data);
    });
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Cruceros y Tours",
    "description": "Agencia de viajes especializada en cruceros de lujo, tours, vuelos y servicios especiales. Destinos en el Caribe, Mediterráneo y todo el mundo.",
    "url": "https://crucerosytours.vercel.app",
    "logo": "https://crucerosytours.vercel.app/logo_cruceros_y_tours_completo_color.png",
    "image": "https://crucerosytours.vercel.app/logo_cruceros_y_tours_completo_color.png",
    "priceRange": "$$",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de viaje",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cruceros de lujo" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tours y destinos" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vuelos internacionales" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Servicios especiales de viaje" } }
      ]
    }
  };

  return (
    <>
      <SEO
        title="Tu Próxima Aventura Comienza Aquí"
        description="Agencia de viajes especializada en cruceros de lujo, tours, vuelos y servicios especiales. Desde el Caribe hasta el Mediterráneo, nosotros te llevamos."
        canonical="/"
        type="website"
        jsonLd={jsonLd}
      />
      <BannerPrincipal />
      <main className="landing_page" style={{ 
        background: 'white',
        minHeight: '100vh', 
        padding: '100px 0 100px',
        position: 'relative'
      }}>
      {/* Elementos decorativos de fondo */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(0, 180, 216, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '3%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(2, 62, 138, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }}></div>

      <div className="container" style={{ maxWidth: '1300px', position: 'relative', zIndex: 1 }}>
        
        <div className="texto_landing_page text-center animate__animated animate__fadeInDown" style={{ 
          marginBottom: '15px',
          padding: '0 20px'
        }}>
          <h1 className="fw-bold" style={{ 
            fontSize: 'clamp(4rem, 7vw, 6rem)',
            marginBottom: '40px',
            color: '#023e8a',
            letterSpacing: '-1px',
            fontFamily: "'Photogenic', serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(135deg, #023e8a 0%, #0077b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 auto 40px',
          }}>
            Bienvenidos a <br/>
            Cruceros y Tours
          </h1>
          <div style={{ marginBottom: '28px' }}>
            <Link
              to="/contacto"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0FD3D3',
                color: '#003366',
                textDecoration: 'none',
                padding: 'clamp(10px, 2vw, 14px) clamp(22px, 4vw, 36px)',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                boxShadow: '0 4px 20px rgba(15, 211, 211, 0.4)',
                border: '2px solid #0FD3D3',
                transition: 'all 0.3s ease',
                fontFamily: "'Chicago Police', sans-serif",
                letterSpacing: '0.3px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#003366';
                e.currentTarget.style.color = '#0FD3D3';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,51,102,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#0FD3D3';
                e.currentTarget.style.color = '#003366';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 211, 211, 0.4)';
              }}
            >
              ✉ Contactar un Agente de Viajes
            </Link>
          </div>
          
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            '--color-primary-dark': '#003366',
            fontWeight: '400',
            margin: '0 auto',
            maxWidth: '700px',
            lineHeight: '1.6',
            fontFamily: "'Lora', 'Georgia', serif",
            paddingTop: '70px'
          }}>
            Aventuras increíbles te esperan
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px',
            marginTop: '15px',
            flexWrap: 'wrap'
          }}>
          </div>
        </div>

        {/* Título del Carrusel */}
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
          color: '#023e8a',
          fontWeight: '700',
          marginBottom: '100px',
          marginTop: '40px',
          letterSpacing: '-0.5px',
          fontFamily: "'Photogenic', serif"
        }}>
          Top 5 Cruceros
        </h2>

        {/* Carrusel 3D */}
        <div className="animate__animated animate__fadeInUp" style={{ marginBottom: '30px' }}>
          <Carousel3D destinations={carouselDestinations.length > 0 ? carouselDestinations : CAROUSEL_FALLBACK} />
        </div>

      </div>

      <DestinosSection />
        <h2 style={{
        textAlign: 'center',
        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
        color: '#023e8a',
        fontWeight: '700',
        marginBottom: '30px',
        marginTop: '40px',
        letterSpacing: '-0.5px',
        fontFamily: "'Photogenic', serif"
      }}>
       VUELA A CUALQUIER DESTINO
      </h2>
      <p style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            '--color-primary-dark': '#003366',
            fontWeight: '400',
        textAlign: 'center',
        margin: '0 auto',
            maxWidth: '700px',
            lineHeight: '1.6',
            fontFamily: "'Photogenic', serif"
          }}>
            Conectamos tus sueños con las mejores aerolíneas del mundo
          </p>
   
      {/* Sección de Aerolíneas */}
      <Aerolineas />
      
      <h2 style={{
        textAlign: 'center',
        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
        color: '#023e8a',
        fontWeight: '700',
        marginBottom: '30px',
        marginTop: '40px',
        letterSpacing: '-0.5px',
        fontFamily: "'Photogenic', serif"
      }}>
       Asistencia de viajes
      </h2>
      <Asistencia />

      <Trenesyvehiculos />

      <Testimonios />

      </main>
    </>
  );
};

export default LandingPage;