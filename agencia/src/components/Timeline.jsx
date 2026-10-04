import "../styles/timeline.css";

const groupByDay = (itinerarios) => {
  const map = {};
  for (const item of itinerarios) {
    if (!map[item.dia]) map[item.dia] = [];
    map[item.dia].push(item);
  }
  return map;
};

const Timeline = ({ itinerarios }) => {
  if (!itinerarios || itinerarios.length === 0) return null;

  const byDay = groupByDay(itinerarios);
  const dias = Object.keys(byDay).sort((a, b) => Number(a) - Number(b));

  return (
    <section className="detalles-section">
      <h2>Itinerario</h2>
      <div className="timeline">
        {dias.map((dia) => {
          const items = byDay[dia];
          return (
            <div key={dia} className="timeline__day">
              <h3 className="timeline__day-title">Día {dia}</h3>
              <div className="timeline__events">
                {items.map((item, index) => {
                  const isLast = index === items.length - 1 && dia === dias[dias.length - 1];
                  return (
                    <div key={item.id} className="timeline-event">
                      <div className="timeline-event__dot-col">
                        <div className="timeline-event__dot" />
                        {!isLast && <div className="timeline-event__connector" />}
                      </div>
                      <div className="timeline-event__content">
                        <h4 className="timeline-event__title">{item.titulo}</h4>
                        {item.categoria && <span className="timeline-event__badge">{item.categoria}</span>}
                        {item.descripcion && <p className="timeline-event__desc">{item.descripcion}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Timeline;
