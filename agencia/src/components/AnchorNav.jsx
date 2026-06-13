import { useState, useEffect, useMemo } from "react";
import "../styles/anchorNav.css";

const SECTIONS = [
  { id: "seccion-info", label: "Info" },
  { id: "seccion-cabinas", label: "Cabinas" },
  { id: "seccion-itinerario", label: "Itinerario" },
  { id: "seccion-instalaciones", label: "Instalaciones" },
];

const AnchorNav = ({ visibleSections }) => {
  const [activeId, setActiveId] = useState("");

  const links = useMemo(
    () => SECTIONS.filter((s) => visibleSections?.[s.id]),
    [visibleSections]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    for (const { id } of links) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [links]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (links.length === 0) return null;

  return (
    <nav className="anchor-nav" aria-label="Navegación de secciones">
      <div className="anchor-nav__inner">
        <div className="anchor-nav__links">
          {links.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`anchor-nav__link ${activeId === id ? "anchor-nav__link--active" : ""}`}
              onClick={(e) => handleClick(e, id)}
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href="#seccion-reserva"
          className="anchor-nav__cta"
          onClick={(e) => handleClick(e, "seccion-reserva")}
        >
          Reservar
        </a>
      </div>
    </nav>
  );
};

export default AnchorNav;
