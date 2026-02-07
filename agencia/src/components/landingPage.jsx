import 'animate.css';
import '../styles/landing.css';
import Carousel3D from './Carousel3D';
import ToursCardsGrid from "./tours_cards.jsx";
import Aerolineas from "./Aerolineas.jsx";
import Asistencia from "./Asistencia.jsx";
import { useState } from 'react';
import Trenesyvehiculos from './Trenes_vehiculos.jsx';
import BannerPrincipal from './banner_principal.jsx';

const LandingPage = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const buttonStyle = {
    background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #023e8a 100%)',
    border: 'none',
    borderRadius: '50px',
    padding: '16px 45px',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '600',
    boxShadow: '0 8px 25px rgba(0, 119, 182, 0.35)',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <>
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
          <div style={{
            display: 'inline-block',
            marginBottom: '5px'
          }}>
          </div>
          <h1 className="fw-bold" style={{ 
            fontSize: 'clamp(4rem, 7vw, 6rem)',
            marginBottom: '2px',
            color: '#023e8a',
            letterSpacing: '-1px',
            fontFamily: "'Photogenic', serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(135deg, #023e8a 0%, #0077b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '-70px',
          }}>
            Bienvenidos a <br/>
            Cruceros y Tours
          </h1>
          
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
          <Carousel3D onModalChange={setIsGalleryOpen} />
        </div>

      </div>

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
        Destinos Nacionales
      </h2>
      {/* Sección de Tours Destacados */}
      <ToursCardsGrid />

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
        Destinos Internacionales
      </h2>

      {/* Sección de Tours Destacados */}
      <ToursCardsGrid />
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


      </main>
    </>
  );
};

export default LandingPage;