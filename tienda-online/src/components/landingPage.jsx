import React, { useEffect } from "react";
import image01 from "/src/imagenes/image01.jpg";
import image02 from "/src/imagenes/image02.jpg";
import image03 from "/src/imagenes/image03.png";
import TopVentas from "./topVentas";


const LandingPage = () => {

  return (

<main className="landing_page">
    <div className="container-fluid">

      {/* Carousel y texto de bienvenida */}
      <div className="row align-items-center">
        <div className="col-md-6">
          <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-inner">

              <div className="carousel-item active" data-bs-interval="2000">
                <img src={image01} className="d-block w-100" alt="imagen 1" />
              </div>

              <div className="carousel-item" data-bs-interval="2000">
                <img src={image02} className="d-block w-100" alt="imagen 2" />
              </div>

              <div className="carousel-item" data-bs-interval="2000">
                <img src={image03} className="d-block w-100" alt="imagen 3" />
              </div>

            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>

            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>
        {/* {texto de bienvenida a la pagina} */}
        <div className="col-md-6 text-center text-md-start">
          <h1 className="display-4">Bienvenido a Kamima Store!</h1>
          <p className="lead">
            En nuestra tienda la innovación y la calidad se unen para transformar tu experiencia tecnológica. 
            Descubre una selección exclusiva de accesorios diseñados para complementar tu estilo de vida.
          </p>

          <a href="/productos" className="btn btn btn-center btn-warning btn-lg animate__animated animate__shakeX animate__infinite" style={{ animationDuration: '10s' }}>Ir a productos</a>
        </div>
      </div>

      {/* Thumbnails */}
      <section className="thumbnails_primeros_productos">
        <div className="thumbnails01">
          <img src={image01} className="img-thumbnail" alt="..." />
          <a className="link_thumbnails" href="">Cargadores</a>
        </div>

        <div className="thumbnails02">
          <img src={image01} className="img-thumbnail" alt="..." />
          <a className="link_thumbnails" href="">Carcasas</a>
        </div>

        <div className="thumbnails03">
          <img src={image01} className="img-thumbnail" alt="..." />
          <a className="link_thumbnails" href="">Audifonos</a>
        </div>
      </section>

      {/* Cards primeros productos */}
      <section className="card_primeros_productos py-1">
        <div className="container">
          <h2 className="texto_card text-center fs-1">JUSTO AHORA!</h2>
          <p className="text-center mb-4">Encuentra Nuestros Nuevos Productos</p>

          <div className="row row-cols-1 row-cols-md-3 g-4">

            {/* Card 1 */}
            <div className="col">
              <div className="card position-relative">
                <div className="card-badge position-absolute top-0 start-0 bg-warning rounded-circle d-flex align-items-center justify-content-center">
                  NUEVO <br /> PRODUCTO
                </div>
                <img src={image01} className="card-img-top" alt="Audifonos" />

                <div className="card-body text-center">
                  <h5 className="card-title">Audifonos</h5>
                  <p className="card-text">descripcion ejemplo</p>
                </div>

                <div className="card-footer text-center">
                  <a href="#" className="btn btn-warning">Comprar</a>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col">
              <div className="card">
                <img src={image01} className="card-img-top" alt="Carcasas Personalizadas" />
                <div className="card-body text-center">
                  <h5 className="card-title">Carcasas Personalizadas</h5>
                  <p className="card-text">descripcion ejemplo</p>
                </div>
                <div className="card-footer text-center">
                  <a href="#" className="btn btn-warning">Comprar</a>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col">
              <div className="card position-relative h-100">
                <div className="card-badge position-absolute top-0 start-0 bg-warning rounded-circle d-flex align-items-center justify-content-center">
                  NUEVO <br /> PRODUCTO
                </div>

                <img src={image01} className="card-img-top" alt="Protector De Pantalla" />

                <div className="card-body text-center">
                  <h5 className="card-title">Protector De Pantalla</h5>
                  <p className="card-text">descripcion ejemplo</p>
                </div>

                <div className="card-footer text-center">
                  <a href="#" className="btn btn-warning">Comprar</a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Fidelización */}
      <div className="fidelizacion_de_clientes text-center p-1 mb-4 mt-4 text-md-center">
        <h2>Cambias mucho de Pantalla?</h2>
        <p>
          Unete a nuestra subscripcion y AHORRA 40%!, Podras obtener Servicios
          Extras!. Sin ataduras, Y a solo un clic de cancelacion.
        </p>
      </div>

      <div className="fidelizacion_iconos text-center">
        <div className="check">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"></path>
          </svg>
          <p className="texto_fedelizacion text-center">Escoje tu producto favorito</p>
        </div>

        <div className="reload">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"></path>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"></path>
          </svg>
          <p className="texto_fedelizacion">Elije el periodo de pago</p>
        </div>

        <div className="x">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
          </svg>
          <p className="texto_fedelizacion">Cancela cuando quieras</p>
        </div>
      </div>

      <div className="boton_fidelizacion text-center">
        <button className="btn">  
          <a className="btn btn-info btn-lg animate__animated animate__fadeInLeft animate__infinite" style={{ animationDuration: '4s' }} href="#">Suscribirse Ahora</a>
        </button>
      </div>

      <div className="text-center mt-3">
        <a className="text-secondary text-decoration-none" href="#">
          Ya tienes una suscripcion? cambia tus preferencias AQUI
        </a>
      </div>

      <TopVentas />
    </div>
</main>
      

  );
};

export default LandingPage;


