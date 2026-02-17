export const Banner = ({
  titulo = "Encuentra tu destino ideal",
  subtitulo = "Explora experiencias únicas y personalizadas alrededor del mundo.",
  imagen = "/src/imagenes/banner_principal.jpeg",
  colorFondo = "#E8863B"
}) => {
  return (
    <div className="banner-generico">
      <style>
        {`
          .banner-generico {
            display: flex;
            width: 100%;
            height: 350px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          }

          .banner-generico .banner-texto {
            flex: 0 0 35%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 40px 50px;
            background-color: ${colorFondo};
          }

          .banner-generico .banner-titulo {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 3rem;
            font-weight: 700;
            color: white;
            margin: 0 0 16px 0;
            line-height: 1.1;
          }

          .banner-generico .banner-subtitulo {
            font-family: 'Lora', Georgia, serif;
            font-size: 1.1rem;
            font-weight: 400;
            font-style: italic;
            color: white;
            margin: 0;
            opacity: 0.95;
          }

          .banner-generico .banner-imagen {
            flex: 1;
            position: relative;
          }

          .banner-generico .banner-imagen img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          @media (max-width: 768px) {
            .banner-generico {
              flex-direction: column;
              height: auto;
              max-width: calc(100vw - 40px);
              margin: 60px auto 30px;
            }

            .banner-generico .banner-texto {
              flex: none;
              padding: 30px;
            }

            .banner-generico .banner-titulo {
              font-size: 2rem;
            }

            .banner-generico .banner-subtitulo {
              font-size: 1rem;
            }

            .banner-generico .banner-imagen {
              height: 200px;
            }
          }
        `}
      </style>

      <div className="banner-texto">
        <h2 className="banner-titulo">{titulo}</h2>
        <p className="banner-subtitulo">{subtitulo}</p>
      </div>

      <div className="banner-imagen">
        <img src={imagen} alt={titulo} loading="eager" decoding="async" />
      </div>
    </div>
  );
};
