import React, { useEffect } from "react";
import Header from "./header.jsx";
import Footer from "./footer.jsx";

// Componente Banner Promocional - Optimizado para imágenes de Canva
// Dimensiones específicas: 1200x300px (ratio 4:1) para banners horizontales
export const BannerPromocional = ({ 
  imagen = "/src/imagenes/celebrity.jpg",
  alt = "Banner Promocional",
  onClick = null
}) => {
  return (
    <div 
      style={{
        width: '100%',
        maxWidth: 'calc(100vw - 40px)',
        margin: '60px auto 40px',
        padding: '0 20px',
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <img 
        className='banner_promocional'
        src={imagen}
        alt={alt}
        style={{
          width: '100%',
          height: 'auto',
          aspectRatio: '4 / 1',
          display: 'block',
          borderRadius: '15px',
          objectFit: 'cover',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (onClick) {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if (onClick) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
          }
        }}
      />
    </div>
  );
};

const BaseLayout = ({ children, title = "TIENDA ONLINE", showBanner = true }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <Header />
      
      <main style={{ background: 'white', minHeight: '100vh' }}>
        {/* Contenido principal */}
        <div className="container py-5">
          {children}
        </div>

        {/* Banner promocional - Ancho completo */}
        {showBanner && <BannerPromocional />}
      </main>

      <Footer />
    </>
  );
};

export default BaseLayout;
