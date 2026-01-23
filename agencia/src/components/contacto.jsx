import React, { useState } from "react";
import '../styles/contacto.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: ""
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setEnviado(true);
    
    setTimeout(() => {
      setEnviado(false);
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
    }, 3000);
  };

  return (
    <div className="contacto-page">
      {/* Hero Section */}
      <div className="contacto-hero">
        <h1 className="contacto-title">Contact & Support</h1>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4 mb-5">
          {/* Contact Form */}
          <div className="col-lg-6">
            <div className="contact-card">
              <h2 className="card-title-contact mb-4">Contact Us</h2>
              
              {enviado && (
                <div className="alert alert-success mb-3">
                  ¡Mensaje enviado exitosamente!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="input-group-contact">
                    <i className="bi bi-person-fill input-icon"></i>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control-contact"
                      placeholder="Your Name"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group-contact">
                    <i className="bi bi-envelope-fill input-icon"></i>
                    <input
                      type="email"
                      name="email"
                      className="form-control-contact"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="input-group-contact">
                    <i className="bi bi-telephone-fill input-icon"></i>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control-contact"
                      placeholder="Your Phone"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="input-group-contact">
                    <i className="bi bi-chat-dots-fill input-icon"></i>
                    <textarea
                      name="mensaje"
                      className="form-control-contact"
                      placeholder="Message"
                      rows="4"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className="btn-send-message">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Travel Expert Section */}
          <div className="col-lg-6">
            <div className="contact-card text-center">
              <h2 className="card-title-contact mb-4">Talk to a Travel Expert</h2>
              
              <div className="expert-image-container mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" 
                  alt="Travel Expert" 
                  className="expert-image"
                />
              </div>

              <p className="expert-text mb-4">
                Have questions? Our travel experts are here to help!
              </p>

              <button className="btn-live-chat">
                Live Chat
              </button>
            </div>
          </div>
        </div>

        {/* Global Locations Section */}
        <div className="locations-section">
          <h2 className="locations-title text-center mb-5">Our Global Locations</h2>
          
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="map-container">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg" 
                  alt="World Map" 
                  className="world-map"
                />
                {/* Location Markers */}
                <div className="map-marker" style={{top: '38%', left: '30%'}} title="Caracas, Venezuela">📍</div>
                <div className="map-marker" style={{top: '60%', left: '29%'}} title="Santiago, Chile">📍</div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="location-info">
                <div className="location-item mb-3">
                  <i className="bi bi-geo-alt-fill text-warning me-2"></i>
                  <span>1234 Wanderlust Ave, Suite 100,<br/>Adventure City, CA 98765</span>
                </div>
                <div className="location-item mb-3">
                  <i className="bi bi-telephone-fill text-warning me-2"></i>
                  <span>+1 (800) 123-4567</span>
                </div>
                <div className="location-item">
                  <i className="bi bi-envelope-fill text-warning me-2"></i>
                  <span>info@travelagency.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
