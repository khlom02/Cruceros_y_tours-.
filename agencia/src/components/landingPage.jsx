import 'animate.css';
import '../styles/landing.css';
import Carousel3D from './Carousel3D';
import { useState } from 'react';

const LandingPage = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  console.log('📊 Estado isGalleryOpen:', isGalleryOpen);

  // 🎨 Configuración de destinos - Solo cambia el nombre del archivo de imagen aquí
  const destinations = [
    { 
      img: "/src/imagenes/MSC.jpg",
      logo: "/src/assets/MSC_logo.png",
      title: "MSC", 
      // subtitle: "MSC", 
      id: 1 
    },
    { 
      img: "/src/imagenes/ncl.jpg",
      logo: "/src/assets/ncl_logo.png",
      title: "NCL", 
      // subtitle: "NCL", 
      id: 2 
    },
    { 
      img: "/src/imagenes/royal_caribean.jpg",
      logo: "/src/assets/royal_caribbean_logo.jpg",
      title: "Royal Caribbean", 
      // subtitle: "Royal Caribbean", 
      id: 3 
    },
    { 
      img: "/src/imagenes/celebrity.jpg",
      logo: "/src/assets/Celebrity_logo.jpg",
        title: "Celebrity", 
      // subtitle: "Celebrity", 
      id: 4 
    },
    { 
      img: "/src/imagenes/costa.jpg",
      logo: "/src/assets/costa_logo.png",
      title: "Costa", 
      // subtitle: "Costa", 
      id: 5 
    }
  ];

  const buttonStyle = {
    background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 50%, #023e8a 100%)',
    border: 'none',
    borderRadius: '50px',
    padding: '16px 45px',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '600',
    boxShadow: '0 8px 25px rgba(0, 119, 182, 0.35)',
    marginTop: '20px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <main className="landing_page" style={{ 
      background: 'white',
      minHeight: '100vh', 
      padding: '60px 0 70px',
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
            <span style={{
              fontSize: '0.95rem',
              color: '#0077b6',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              padding: '8px 24px',
              background: 'rgba(0, 180, 216, 0.1)',
              borderRadius: '30px',
              border: '2px solid rgba(0, 180, 216, 0.2)'
            }}>
              ✈️ Viajes Memorables
            </span>
          </div>
          
          <h1 className="fw-bold" style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            marginBottom: '8px',
            color: '#023e8a',
            letterSpacing: '-1px',
            lineHeight: '1.15',
            fontFamily: "'Playfair Display', 'Georgia', serif",
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(135deg, #023e8a 0%, #0077b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Bienvenidos a Cruceros y Tours
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            color: '#495057',
            fontWeight: '400',
            margin: '0 auto',
            maxWidth: '700px',
            lineHeight: '1.6',
            fontFamily: "'Lora', 'Georgia', serif"
          }}>
            Aventuras increíbles te esperan
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px',
            marginTop: '5px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                color: '#0077b6',
                marginBottom: '5px'
              }}>500+</div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#6c757d',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Destinos</div>
            </div>
          
          </div>
        </div>

        {/* Título del Carrusel */}
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
          color: '#023e8a',
          fontWeight: '700',
          marginBottom: '30px',
          marginTop: '40px',
          letterSpacing: '-0.5px',
          fontFamily: "'Playfair Display', 'Georgia', serif"
        }}>
          Top 5 Cruceros
        </h2>

        {/* Carrusel 3D */}
        <div className="animate__animated animate__fadeInUp" style={{ marginBottom: '0px' }}>
          <Carousel3D destinations={destinations} onModalChange={setIsGalleryOpen} />
        </div>

        <div 
          className="text-center" 
          style={{ 
            marginTop: '-200px',
            transform: isGalleryOpen ? 'translateY(600px) !important' : 'translateY(0)',
            transition: 'all 0.4s ease-in-out',
            opacity: isGalleryOpen ? '0' : '1',
            visibility: isGalleryOpen ? 'hidden' : 'visible',
            pointerEvents: isGalleryOpen ? 'none' : 'auto',
            position: 'relative',
            zIndex: isGalleryOpen ? '-1' : '10',
          }}
        >
          <button 
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 119, 182, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 119, 182, 0.35)';
            }}
          >
            🌴 Reserva tu Aventura
          </button>
          
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              color: '#0077b6',
              fontSize: '0.95rem'
            }}>
              <span style={{ fontSize: '1.3rem' }}>✓</span>
              <span>Cancelación gratuita</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              color: '#0077b6',
              fontSize: '0.95rem'
            }}>
              <span style={{ fontSize: '1.3rem' }}>✓</span>
              <span>Pago seguro</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              color: '#0077b6',
              fontSize: '0.95rem'
            }}>
              <span style={{ fontSize: '1.3rem' }}>✓</span>
              <span>Mejor precio garantizado</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default LandingPage;