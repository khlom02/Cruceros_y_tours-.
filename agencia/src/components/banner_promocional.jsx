import React from "react";

// Componente Banner Promocional - Optimizado para imágenes de Canva
// Dimensiones específicas: 1200x300px (ratio 4:1) para banners horizontales
export const BannerPromocional = ({ 
  imagen = "/src/imagenes/silversea.jpg",
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
        loading="lazy"
        decoding="async"
        style={{
          width: '100%',
          height: '25rem',
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


