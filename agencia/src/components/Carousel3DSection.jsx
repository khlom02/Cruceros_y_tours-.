import Carousel3D from "./Carousel3D.jsx";
import "../styles/carousel3DSection.css";

const Carousel3DSection = ({ items = [], title, subtitle }) => {
  if (!items.length) return null;

  const middleIndex = Math.floor(items.length / 2);

  return (
    <section className="carousel3d-section">
      <Carousel3D
        destinations={items}
        showCTA={false}
        startIndex={middleIndex}
        title={title}
        subtitle={subtitle}
      />
    </section>
  );
};

export default Carousel3DSection;
