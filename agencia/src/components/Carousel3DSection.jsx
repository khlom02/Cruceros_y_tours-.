import Carousel3D from "./Carousel3D.jsx";
import "../styles/carousel3DSection.css";

const Carousel3DSection = ({ items = [], title, subtitle }) => {
  if (!items.length) return null;

  const middleIndex = Math.floor(items.length / 2);

  return (
    <section className="carousel3d-section">
      {(title || subtitle) && (
        <header className="carousel3d-section__header">
          {title && <h2 className="carousel3d-section__title">{title}</h2>}
          {subtitle && (
            <p className="carousel3d-section__subtitle">{subtitle}</p>
          )}
        </header>
      )}
      <Carousel3D destinations={items} showCTA={false} startIndex={middleIndex} />
    </section>
  );
};

export default Carousel3DSection;
