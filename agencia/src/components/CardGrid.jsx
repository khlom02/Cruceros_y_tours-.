import "../styles/card-base.css";

const CardGrid = ({ children, variant = "" }) => (
  <div className={`card-grid card-grid--${variant}`}>
    {children}
  </div>
);

export default CardGrid;
