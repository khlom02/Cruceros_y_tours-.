import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "../styles/carrusel3D.css";

// Devuelve dimensiones del carrusel según el ancho de pantalla.
// xSpacing se calcula dinámicamente para garantizar que las cards adyacentes (±1)
// siempre quepan dentro del viewport sin desbordarse, en cualquier tamaño de pantalla.
const getCarouselConfig = (w) => {
  let cardW, cardH, containerH;

  if      (w <= 480)  { cardW = 240; cardH = 290; containerH = 340; }
  else if (w <= 768)  { cardW = 280; cardH = 330; containerH = 390; }
  else if (w <= 1100) { cardW = 330; cardH = 375; containerH = 440; }
  else                { cardW = 400; cardH = 420; containerH = 500; }

  // La card adyacente debe caber: xSpacing + cardW/2 ≤ w/2 - margen
  // Nunca superar 370 (valor original desktop)
  const xSpacing = Math.min(370, Math.floor(w / 2 - cardW / 2 - 15));

  return { cardW, cardH, xSpacing, containerH };
};

const Carousel3D = ({ destinations = [], onModalChange }) => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const cardsRef = useRef([]);
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
  });
  const modalDragRef = useRef({
    isDragging: false,
    startX: 0,
    currentX: 0,
  });

  // Actualizar posiciones de las cards al cambiar slide o tamaño de pantalla
  useEffect(() => {
    updateCarousel();
  }, [currentIndex, windowWidth]);

  // Escuchar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        navigateModal('prev');
      } else if (e.key === 'ArrowRight') {
        navigateModal('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, destinations.length]);

  const updateCarousel = () => {
    const w = window.innerWidth;
    const { xSpacing } = getCarouselConfig(w);
    // En móvil pequeño (≤480) solo la card central; en el resto, central + adyacentes (±1)
    // Las cards ±2 siempre se ocultan para evitar desbordamiento más allá del contenedor
    const maxVisible = w <= 480 ? 0 : 1;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const offset = index - currentIndex;
      const absOffset = Math.abs(offset);

      // Configuración para cada posición (xSpacing responsive)
      let x = offset * xSpacing; // Separación horizontal
      let z = -absOffset * 100; // Profundidad
      let rotateY = offset * 25; // Rotación
      // Ocultar completamente las cards que quedan demasiado lejos en móvil
      let opacity = absOffset > maxVisible ? 0 : absOffset === 0 ? 1 : 0.6;
      let scale = absOffset === 0 ? 1 : 0.8;
      let zIndex = 10 - absOffset;
      let pointerEvents = absOffset > maxVisible ? "none" : "auto";

      gsap.to(card, {
        x: x,
        z: z,
        rotateY: rotateY,
        opacity: opacity,
        scale: scale,
        zIndex: zIndex,
        pointerEvents: pointerEvents,
        duration: 0.4,
        ease: "power3.out",
      });
    });
  };

  const navigate = (direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prevIndex) => {
      if (direction === "next") {
        return (prevIndex + 1) % destinations.length;
      } else {
        return (prevIndex - 1 + destinations.length) % destinations.length;
      }
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const handleDragStart = (e) => {
    if (isAnimating) return;

    e.preventDefault();

    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;

    dragStateRef.current = {
      isDragging: true,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
    };
  };

  const handleDragMove = (e) => {
    if (!dragStateRef.current.isDragging) return;

    e.preventDefault();

    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    dragStateRef.current.currentX = clientX;
  };

  const handleDragEnd = () => {
    if (!dragStateRef.current.isDragging) return;

    const deltaX = dragStateRef.current.currentX - dragStateRef.current.startX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        navigate("prev");
      } else {
        navigate("next");
      }
    }

    dragStateRef.current.isDragging = false;
  };

  const openModal = (index) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
    console.log('🔵 GALERÍA ABIERTA - Llamando onModalChange(true)');
    if (onModalChange) {
      onModalChange(true);
    } else {
      console.warn('⚠️ onModalChange no está definido');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    console.log('🔴 GALERÍA CERRADA - Llamando onModalChange(false)');
    if (onModalChange) {
      onModalChange(false);
    } else {
      console.warn('⚠️ onModalChange no está definido');
    }
  };

  const navigateModal = (direction) => {
    if (direction === 'next') {
      setModalImageIndex((prev) => (prev + 1) % destinations.length);
    } else {
      setModalImageIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
    }
  };

  const handleModalDragStart = (e) => {
    e.stopPropagation();
    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    
    modalDragRef.current = {
      isDragging: true,
      startX: clientX,
      currentX: clientX,
    };
  };

  const handleModalDragMove = (e) => {
    if (!modalDragRef.current.isDragging) return;
    e.stopPropagation();
    
    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    modalDragRef.current.currentX = clientX;
  };

  const handleModalDragEnd = (e) => {
    if (!modalDragRef.current.isDragging) return;
    e.stopPropagation();

    const deltaX = modalDragRef.current.currentX - modalDragRef.current.startX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        navigateModal('prev');
      } else {
        navigateModal('next');
      }
    }

    modalDragRef.current.isDragging = false;
  };

  // Dimensiones responsive del carrusel
  const { cardW, cardH, containerH } = getCarouselConfig(windowWidth);

  // Posición de los botones de navegación del modal:
  // En pantallas > 1024px los botones van fuera del contenedor (left/right negativos).
  // En pantallas ≤ 1024px van dentro, para que no queden fuera del viewport.
  const modalNavButtonLeft = windowWidth > 1024 ? '-70px' : '8px';
  const modalNavButtonRight = windowWidth > 1024 ? '-70px' : '8px';
  const modalNavButtonSize = windowWidth <= 768 ? '44px' : '60px';
  const modalNavButtonFontSize = windowWidth <= 768 ? '26px' : '32px';

  // tamaño de las cards y estilos generales (responsive)
  const cardStyle = {
    width: `${cardW}px`,
    height: `${cardH}px`,
    borderRadius: "20px",
    overflow: "hidden",
    position: "absolute",
    border: "none",
    cursor: "pointer",
    willChange: "transform",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
  };

  // posicion del texto sobre la imagen y estilos
  const overlayStyle = {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    userSelect: "none",
    WebkitUserSelect: "none",
  };

  // fontSize responsive calculado dinámicamente según el ancho de pantalla
  const titleFontSize = windowWidth <= 480 ? '1rem' : windowWidth <= 768 ? '1.3rem' : '1.8rem';

  const titleStyle = {
    color: "white",
    fontSize: titleFontSize,
    fontWeight: "600",
    fontFamily: "'Serif', 'Georgia', serif",
    marginBottom: "8px",
    // textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    userSelect: "none",
  };

  const textStyle = {
    color: "rgba(255,255,255,0.95)",
    fontSize: "1.1rem",
    fontWeight: "300",
    marginBottom: 0,
    userSelect: "none",
  };

  const isVideo = (src) =>
    typeof src === "string" && /\.(mp4|webm|ogg)$/i.test(src);

  return (
    // overflow-x:hidden previene scroll horizontal sin cortar las cards verticalmente
    <div style={{ overflowX: "hidden", width: "100%" }}>
    <div
      style={{
        perspective: "2000px",
        height: `${containerH}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginBottom: 8,
        padding: "0 10px",
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {destinations.map((dest, index) => {
          const handleCardClick = (e) => {
            // Verificar si fue un drag o un click
            const wasDragging = Math.abs(dragStateRef.current.currentX - dragStateRef.current.startX) > 10;
            
            if (isAnimating || wasDragging) return;

            // Si es la card central, abrir modal
            if (index === currentIndex) {
              e.stopPropagation();
              openModal(index);
              return;
            }

            // Si no es la central, navegar hacia ella
            const diff = index - currentIndex;

            let direction;
            if (Math.abs(diff) === 1) {
              direction = diff > 0 ? "next" : "prev";
            } else {
              if (currentIndex === 1) {
                direction = index === 0 ? "prev" : "next";
              } else if (currentIndex === 0) {
                direction = index === 1 ? "next" : "prev";
              } else {
                direction = index === 1 ? "prev" : "next";
              }
            }

            navigate(direction);
          };

          return (
            <div
              key={dest.id}
              ref={(el) => (cardsRef.current[index] = el)}
              onClick={handleCardClick}
              style={{
                ...cardStyle,
                left: "50%",
                top: "50%",
                marginLeft: `${-cardW / 2}px`,
                marginTop: `${-cardH / 2}px`,
                cursor: "grab",
              }}
              onMouseEnter={(e) => {
                if (!isAnimating) {
                  gsap.to(e.currentTarget, {
                    scale: index === currentIndex ? 1.05 : 0.85,
                    boxShadow:
                      index === currentIndex
                        ? "0 30px 80px rgba(0,0,0,0.4)"
                        : "0 15px 40px rgba(0,0,0,0.25)",
                    duration: 0.3,
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnimating) {
                  gsap.to(e.currentTarget, {
                    scale: index === currentIndex ? 1 : 0.8,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                    duration: 0.3,
                  });
                }
              }}
            >
              {isVideo(dest.img) ? (
                <video
                  src={dest.img}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              ) : (
                <img
                  src={dest.img}
                  alt={dest.title}
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              )}
              <div style={overlayStyle}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '15px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={titleStyle}>{dest.title}</h5>
                    <p style={textStyle}>{dest.subtitle}</p>
                  </div>
                  {dest.logo && (
                    <div style={{
                      width: windowWidth <= 480 ? '70px' : windowWidth <= 768 ? '88px' : '110px',
                      height: windowWidth <= 480 ? '60px' : windowWidth <= 768 ? '76px' : '95px',
                      flexShrink: 0,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}>
                      <img
                        src={dest.logo}
                        alt="Logo"
                        loading="lazy"
                        decoding="async"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          pointerEvents: 'none',
                          userSelect: 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de galería */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-in-out',
            padding: '20px',
          }}
          onClick={closeModal}
        >
          {/* Botón de cerrar - Estilizado según la página */}
          <button
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: '15px',
              right: '15px',
              width: '55px',
              height: '55px',
              borderRadius: '50%',
              border: '2px solid rgba(64, 224, 208, 0.5)',
              background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.9) 0%, rgba(0, 119, 182, 0.9) 100%)',
              color: 'white',
              fontSize: '28px',
              fontWeight: '300',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              zIndex: 10002,
              boxShadow: '0 8px 25px rgba(0, 180, 216, 0.4)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #40E0D0 0%, #00b4d8 100%)';
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(64, 224, 208, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 180, 216, 0.9) 0%, rgba(0, 119, 182, 0.9) 100%)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 180, 216, 0.4)';
            }}
          >
            ×
          </button>

          {/* Contenedor de la imagen y contenido */}
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleModalDragStart}
            onMouseMove={handleModalDragMove}
            onMouseUp={handleModalDragEnd}
            onMouseLeave={handleModalDragEnd}
            onTouchStart={handleModalDragStart}
            onTouchMove={handleModalDragMove}
            onTouchEnd={handleModalDragEnd}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              maxWidth: '1800px',
              maxHeight: '95vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'zoomIn 0.3s ease-out',
              cursor: 'grab',
            }}
          >
            {/* Botón anterior */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateModal('prev');
              }}
              style={{
                position: 'absolute',
                left: modalNavButtonLeft,
                top: windowWidth <= 1024 ? '50%' : undefined,
                transform: windowWidth <= 1024 ? 'translateY(-50%)' : undefined,
                width: modalNavButtonSize,
                height: modalNavButtonSize,
                borderRadius: '50%',
                border: '2px solid rgba(64, 224, 208, 0.6)',
                background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.95) 0%, rgba(0, 119, 182, 0.95) 100%)',
                color: 'white',
                fontSize: modalNavButtonFontSize,
                fontWeight: '300',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                zIndex: 10001,
                boxShadow: '0 8px 25px rgba(0, 180, 216, 0.4)',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #40E0D0 0%, #00b4d8 100%)';
                e.currentTarget.style.transform = 'scale(1.15) translateX(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(64, 224, 208, 0.6)';
                e.currentTarget.style.borderColor = '#40E0D0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 180, 216, 0.95) 0%, rgba(0, 119, 182, 0.95) 100%)';
                e.currentTarget.style.transform = 'scale(1) translateX(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 180, 216, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(64, 224, 208, 0.6)';
              }}
            >
              ‹
            </button>

            {/* Imagen y contenido */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 25px 100px rgba(0, 0, 0, 0.8)',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isVideo(destinations[modalImageIndex].img) ? (
                <video
                  src={destinations[modalImageIndex].img}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                />
              ) : (
                <img
                  src={destinations[modalImageIndex].img}
                  alt={destinations[modalImageIndex].title}
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  draggable="false"
                />
              )}
              
              {/* Overlay con información */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                  padding: '60px 40px 30px',
                  color: 'white',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h2
                      style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        fontWeight: '700',
                        marginBottom: '10px',
                        fontFamily: "'Playfair Display', serif",
                        textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      {destinations[modalImageIndex].title}
                    </h2>
                    <p
                      style={{
                        fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                        fontWeight: '300',
                        margin: 0,
                        opacity: 0.95,
                      }}
                    >
                      {destinations[modalImageIndex].subtitle}
                    </p>
                  </div>
                  {destinations[modalImageIndex].logo && (
                    <div style={{
                      width: '140px',
                      height: '125px',
                      flexShrink: 0,
                      borderRadius: '15px',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)'
                    }}>
                      <img
                        src={destinations[modalImageIndex].logo}
                        alt="Logo"
                        loading="lazy"
                        decoding="async"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          pointerEvents: 'none',
                          userSelect: 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Contador */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {modalImageIndex + 1} / {destinations.length}
              </div>
            </div>

            {/* Botón siguiente - Estilizado según la página */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateModal('next');
              }}
              style={{
                position: 'absolute',
                right: modalNavButtonRight,
                top: windowWidth <= 1024 ? '50%' : undefined,
                transform: windowWidth <= 1024 ? 'translateY(-50%)' : undefined,
                width: modalNavButtonSize,
                height: modalNavButtonSize,
                borderRadius: '50%',
                border: '2px solid rgba(64, 224, 208, 0.6)',
                background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.95) 0%, rgba(0, 119, 182, 0.95) 100%)',
                color: 'white',
                fontSize: modalNavButtonFontSize,
                fontWeight: '300',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                zIndex: 10001,
                boxShadow: '0 8px 25px rgba(0, 180, 216, 0.4)',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #40E0D0 0%, #00b4d8 100%)';
                e.currentTarget.style.transform = 'scale(1.15) translateX(5px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(64, 224, 208, 0.6)';
                e.currentTarget.style.borderColor = '#40E0D0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 180, 216, 0.95) 0%, rgba(0, 119, 182, 0.95) 100%)';
                e.currentTarget.style.transform = 'scale(1) translateX(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 180, 216, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(64, 224, 208, 0.6)';
              }}
            >
              ›
            </button>
          </div>

          {/* Miniaturas */}
          <div
            style={{
              position: 'fixed',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '15px',
              padding: '12px 20px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50px',
              backdropFilter: 'blur(10px)',
              maxWidth: '90vw',
              overflowX: 'auto',
            }}
          >
            {destinations.map((dest, index) => (
              <div
                key={dest.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex(index);
                }}
                style={{
                  minWidth: '60px',
                  width: '60px',
                  height: '60px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: modalImageIndex === index ? '3px solid #40E0D0' : '3px solid transparent',
                  opacity: modalImageIndex === index ? 1 : 0.6,
                  transition: 'all 0.3s ease',
                  transform: modalImageIndex === index ? 'scale(1.1)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (modalImageIndex !== index) {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (modalImageIndex !== index) {
                    e.currentTarget.style.opacity = '0.6';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <img
                  src={dest.img}
                  alt={dest.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none',
                  }}
                  draggable="false"
                />
              </div>
            ))}
          </div>

          <style>
            {`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              @keyframes zoomIn {
                from {
                  transform: scale(0.8);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            `}
          </style>
        </div>
      )}
    </div>

    {/* Indicadores — fuera del contexto 3D para evitar solapamiento */}
    <div
      className={`carousel3d-indicators ${isModalOpen ? "is-hidden" : ""}`}
    >
      <div className="carousel3d-indicator-row">
        {destinations.map((_, index) => (
          <button
            key={index}
            className={`carousel3d-indicator ${
              currentIndex === index ? "is-active" : ""
            }`}
            onClick={() => {
              if (index !== currentIndex && !isAnimating) {
                setCurrentIndex(index);
              }
            }}
          />
        ))}
      </div>

      <div className="carousel3d-cta text-center">
        <button
          className="carousel3d-cta-button"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px) scale(1.05)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 119, 182, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 119, 182, 0.35)";
          }}
        >
          🌴 Reserva tu Aventura
        </button>

        <div className="carousel3d-perks">
          <div className="carousel3d-perk">
            <span className="carousel3d-perk-icon">✓</span>
            <span>Cancelación gratuita</span>
          </div>
          <div className="carousel3d-perk">
            <span className="carousel3d-perk-icon">✓</span>
            <span>Pago seguro</span>
          </div>
          <div className="carousel3d-perk">
            <span className="carousel3d-perk-icon">✓</span>
            <span>Mejor precio garantizado</span>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
};

export default Carousel3D;
