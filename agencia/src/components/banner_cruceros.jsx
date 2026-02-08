export const BannerCruceros = ({
  titulo = "Encuentra tu destino ideal",
  subtitulo = "Explora experiencias únicas y personalizadas alrededor del mundo.",
  imagen = "/src/imagenes/banner_principal.jpeg",
  colorFondo = "#E8863B"
}) => {
  return (
    <div className="banner-cruceros">
      <style>
        {`
          .banner-cruceros {
            display: flex;
            width: 100%;
            height: 350px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          }

          .banner-texto {
            flex: 0 0 35%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 40px 50px;
            background-color: ${colorFondo};
          }

          .banner-titulo {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 3rem;
            font-weight: 700;
            color: white;
            margin: 0 0 16px 0;
            line-height: 1.1;
          }

          .banner-subtitulo {
            font-family: 'Lora', Georgia, serif;
            font-size: 1.1rem;
            font-weight: 400;
            font-style: italic;
            color: white;
            margin: 0;
            opacity: 0.95;
          }

          .banner-imagen {
            flex: 1;
            position: relative;
          }

          .banner-imagen img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          @media (max-width: 768px) {
            .banner-cruceros {
              flex-direction: column;
              height: auto;
              max-width: calc(100vw - 40px);
              margin: 60px auto 30px;
            }

            .banner-texto {
              flex: none;
              padding: 30px;
            }

            .banner-titulo {
              font-size: 2rem;
            }

            .banner-subtitulo {
              font-size: 1rem;
            }

            .banner-imagen {
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
        <img src={imagen} alt={titulo} />
      </div>
    </div>
  );
};
