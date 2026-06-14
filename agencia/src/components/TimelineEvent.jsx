const TimelineEvent = ({ titulo, descripcion, categoria, isLast }) => (
  <div className="timeline-event">
    <div className="timeline-event__dot-col">
      <div className="timeline-event__dot" />
      {!isLast && <div className="timeline-event__connector" />}
    </div>
    <div className="timeline-event__content">
      <h4 className="timeline-event__title">{titulo}</h4>
      {categoria && <span className="timeline-event__badge">{categoria}</span>}
      {descripcion && <p className="timeline-event__desc">{descripcion}</p>}
    </div>
  </div>
);

export default TimelineEvent;
