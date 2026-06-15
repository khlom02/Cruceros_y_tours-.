import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import "../styles/carousel3DGroup.css";

const chunkArray = (arr, size) => {
  if (!Array.isArray(arr) || size <= 0) return [];
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const isVideo = (src) =>
  typeof src === "string" && /\.(mp4|webm|ogg)$/i.test(src);

const Carousel3DGroup = ({
  items = [],
  title,
  subtitle,
  minItemsPerGroup = 1,
  maxItemsPerGroup = 3,
  showIndicators = true,
  showArrows = true,
  className = "",
}) => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerGroup = useMemo(() => {
    if (windowWidth <= 480) return Math.max(minItemsPerGroup, 1);
    if (windowWidth <= 900) return Math.min(2, maxItemsPerGroup);
    return maxItemsPerGroup;
  }, [windowWidth, minItemsPerGroup, maxItemsPerGroup]);

  const groups = useMemo(
    () => chunkArray(items, itemsPerGroup),
    [items, itemsPerGroup]
  );

  const activeGroup = useMemo(
    () => Math.min(currentGroup, Math.max(0, groups.length - 1)),
    [currentGroup, groups.length]
  );

  const navigate = useCallback(
    (direction) => {
      if (groups.length <= 1) return;
      setCurrentGroup((prev) => {
        if (direction === "next") {
          return prev === groups.length - 1 ? 0 : prev + 1;
        }
        return prev === 0 ? groups.length - 1 : prev - 1;
      });
    },
    [groups.length]
  );

  const handleDragStart = (e) => {
    const clientX = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;
    dragStartX.current = clientX;
    dragCurrentX.current = clientX;
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;
    dragCurrentX.current = clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const deltaX = dragCurrentX.current - dragStartX.current;
    const threshold = 50;
    if (Math.abs(deltaX) > threshold) {
      navigate(deltaX > 0 ? "prev" : "next");
    }
    setIsDragging(false);
  };

  if (!items.length) return null;

  return (
    <section className={`carousel3d-group ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="carousel3d-group__header">
          {title && <h2 className="carousel3d-group__title">{title}</h2>}
          {subtitle && (
            <p className="carousel3d-group__subtitle">{subtitle}</p>
          )}
        </header>
      )}

      <div className="carousel3d-group__viewport">
        {showArrows && groups.length > 1 && (
          <button
            type="button"
            className="carousel3d-group__arrow carousel3d-group__arrow--prev"
            onClick={() => navigate("prev")}
            aria-label="Anterior"
          >
            ‹
          </button>
        )}

        <div
          className="carousel3d-group__track-wrapper"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div
            ref={trackRef}
            className="carousel3d-group__track"
            style={{
              transform: `translateX(-${activeGroup * 100}%)`,
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {groups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="carousel3d-group__slide"
                aria-label={`Grupo ${groupIndex + 1} de ${groups.length}`}
              >
                {group.map((item) => (
                  <article
                    key={item.id}
                    className="carousel3d-group__card"
                    style={{
                      flex: `0 0 calc(${100 / itemsPerGroup}% - var(--card-grid-gap) * ${
                        (itemsPerGroup - 1) / itemsPerGroup
                      })`,
                    }}
                  >
                    <div className="carousel3d-group__media">
                      {isVideo(item.img) ? (
                        <video
                          src={item.img}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={item.img}
                          alt={item.title || ""}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </div>

                    <div className="carousel3d-group__overlay">
                      <div className="carousel3d-group__content">
                        <h3 className="carousel3d-group__card-title">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="carousel3d-group__card-subtitle">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      {item.logo && (
                        <div className="carousel3d-group__logo">
                          <img
                            src={item.logo}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        {showArrows && groups.length > 1 && (
          <button
            type="button"
            className="carousel3d-group__arrow carousel3d-group__arrow--next"
            onClick={() => navigate("next")}
            aria-label="Siguiente"
          >
            ›
          </button>
        )}
      </div>

      {showIndicators && groups.length > 1 && (
        <div className="carousel3d-group__indicators">
          {groups.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`carousel3d-group__indicator ${
                activeGroup === index ? "is-active" : ""
              }`}
              onClick={() => setCurrentGroup(index)}
              aria-label={`Ir al grupo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Carousel3DGroup;
