import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/productos.css';

export default function Experiencias() {
  const navigate = useNavigate();

  const experiencias = [
    {
      id: 1,
      titulo: "Private Vineyard Tour in Tuscany",
      location: "Tuscany, Italy",
      precio: 1180,
      imagen: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80",
      categoria: "tours",
      descripcion: "Indulge in an exclusive vineyard tour through the rolling hills of Tuscany. Visit family-owned wineries, taste world-class Chianti wines, and enjoy authentic Italian cuisine prepared by local chefs. This intimate experience includes private transportation and a personal sommelier guide.",
      weather: { temp: 24, condition: "Sunny", location: "Tuscany" },
      included: [
        { icon: "🍷", title: "Wine Tasting", description: "Premium selections" },
        { icon: "🚗", title: "Private Transport", description: "Luxury vehicle" },
        { icon: "👨‍🍳", title: "Gourmet Lunch", description: "Traditional cuisine" },
        { icon: "📸", title: "Photo Tour", description: "Professional shots" },
        { icon: "🏛️", title: "Historic Sites", description: "Medieval villages" },
        { icon: "🧀", title: "Local Delicacies", description: "Cheese & olive oil" }
      ]
    },
    {
      id: 2,
      titulo: "Northern Lights Glamping",
      location: "Iceland",
      precio: 250,
      imagen: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&q=80",
      categoria: "experiencias",
      descripcion: "Experience the magic of the Aurora Borealis from the comfort of a luxury heated dome. Located in Iceland's remote countryside, away from light pollution, this glamping experience offers the perfect vantage point for viewing nature's most spectacular light show.",
      weather: { temp: -2, condition: "Clear", location: "Reykjavik" },
      included: [
        { icon: "⛺", title: "Luxury Dome", description: "Heated & comfortable" },
        { icon: "🌌", title: "Aurora Viewing", description: "Best locations" },
        { icon: "📷", title: "Photography Guide", description: "Expert tips" },
        { icon: "🍲", title: "Hot Meals", description: "Local specialties" },
        { icon: "🔥", title: "Campfire Experience", description: "Evening gathering" },
        { icon: "🚐", title: "Transportation", description: "Pick-up included" }
      ]
    },
    {
      id: 3,
      titulo: "Sunset Camel Trek in the Sahara",
      location: "Morocco",
      precio: 150,
      imagen: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80",
      categoria: "tours",
      descripcion: "Journey into the golden dunes of the Sahara Desert on a traditional camel trek. Watch the sun set over endless sand dunes, enjoy a traditional Berber dinner under the stars, and spend the night in an authentic desert camp complete with traditional music and storytelling.",
      weather: { temp: 28, condition: "Clear", location: "Marrakech" },
      included: [
        { icon: "🐪", title: "Camel Ride", description: "Traditional trek" },
        { icon: "🏕️", title: "Desert Camp", description: "Authentic bedouin tents" },
        { icon: "🌅", title: "Sunset Views", description: "Panoramic vistas" },
        { icon: "🍽️", title: "Berber Dinner", description: "Traditional feast" },
        { icon: "🎵", title: "Live Music", description: "Local musicians" },
        { icon: "⭐", title: "Stargazing", description: "Clear desert skies" }
      ]
    },
    {
      id: 4,
      titulo: "Explore Angkor Wat",
      location: "Cambodia",
      precio: 75,
      imagen: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80",
      categoria: "tours",
      descripcion: "Discover the ancient temples of Angkor Wat with an expert archaeologist guide. Explore the largest religious monument in the world, learn about Khmer civilization, and witness sunrise over the iconic temple complex. This tour includes lesser-known temples and hidden jungle ruins.",
      weather: { temp: 32, condition: "Partly Cloudy", location: "Siem Reap" },
      included: [
        { icon: "🏛️", title: "Temple Pass", description: "All-access entry" },
        { icon: "👨‍🏫", title: "Expert Guide", description: "Archaeologist" },
        { icon: "🌅", title: "Sunrise Tour", description: "Best photo spots" },
        { icon: "🚙", title: "Tuk-Tuk Transport", description: "Authentic travel" },
        { icon: "💧", title: "Refreshments", description: "Water & snacks" },
        { icon: "📚", title: "History Lessons", description: "Cultural insights" }
      ]
    },
    {
      id: 5,
      titulo: "Desert Safari Adventure",
      location: "Dubai, UAE",
      precio: 120,
      imagen: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=80",
      categoria: "tours",
      descripcion: "Experience the thrill of dune bashing in a 4x4 vehicle, try sandboarding down massive dunes, and enjoy a traditional Arabian night at a desert camp. This adventure includes camel rides, henna painting, falconry displays, and a BBQ dinner with belly dancing entertainment.",
      weather: { temp: 35, condition: "Sunny", location: "Dubai" },
      included: [
        { icon: "🚙", title: "Dune Bashing", description: "4x4 adventure" },
        { icon: "🏄", title: "Sandboarding", description: "Thrilling rides" },
        { icon: "🐪", title: "Camel Rides", description: "Traditional experience" },
        { icon: "🦅", title: "Falconry Show", description: "Live demonstration" },
        { icon: "🍖", title: "BBQ Dinner", description: "Arabic cuisine" },
        { icon: "💃", title: "Entertainment", description: "Belly dancing show" }
      ]
    },
    {
      id: 6,
      titulo: "Taronga Helicopter Island Tour",
      location: "Sydney, Australia",
      precio: 300,
      imagen: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      categoria: "tours",
      descripcion: "Soar above Sydney's iconic harbor in a luxury helicopter tour. Enjoy breathtaking aerial views of the Opera House, Harbour Bridge, and pristine beaches. Land on a secluded island for a gourmet picnic lunch and swimming in crystal-clear waters before returning via scenic coastal route.",
      weather: { temp: 26, condition: "Sunny", location: "Sydney" },
      included: [
        { icon: "🚁", title: "Helicopter Tour", description: "Luxury flight" },
        { icon: "🏝️", title: "Island Landing", description: "Private beach" },
        { icon: "🍽️", title: "Gourmet Picnic", description: "Chef-prepared" },
        { icon: "🏊", title: "Swimming", description: "Pristine waters" },
        { icon: "📸", title: "Aerial Photos", description: "Professional shots" },
        { icon: "🥂", title: "Champagne", description: "Celebration toast" }
      ]
    }
  ];

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #e3f2fd 100%)',
      minHeight: "100vh" 
    }}>
      {/* Hero Section */}
      <div 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "450px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center"
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(rgba(2, 62, 138, 0.4), rgba(0, 119, 182, 0.5))"
        }}></div>
        
        <div style={{ position: "relative", zIndex: 1, padding: "0 20px" }}>
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 5vw, 4rem)", 
            fontWeight: "400",
            fontFamily: "'Playfair Display', Georgia, serif",
            marginBottom: "1.2rem",
            letterSpacing: "-1px",
            textShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            Experiencias & Tours
          </h1>
          <p style={{ 
            fontSize: "clamp(1rem, 2vw, 1.3rem)", 
            fontWeight: "300",
            fontFamily: "'Lora', Georgia, serif",
            maxWidth: "600px",
            margin: "0 auto",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)"
          }}>
            Actividades y tours seleccionados para hacer que tu viaje sea inolvidable
          </p>
        </div>
        
        <div style={{
          position: "absolute",
          bottom: "-2px",
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 50%, #e3f2fd 100%)",
          clipPath: "ellipse(100% 100% at 50% 100%)"
        }}></div>
      </div>

      {/* Cards Grid */}
      <div className="container" style={{ paddingTop: "60px", paddingBottom: "80px", maxWidth: "1300px" }}>
        <div className="row g-4">
          {experiencias.map((exp) => (
            <div key={exp.id} className="col-12 col-md-6 col-lg-4">
              <div 
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 119, 182, 0.15)",
                  height: "420px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 119, 182, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 119, 182, 0.15)";
                }}
                onClick={() => navigate(`/detalles/${exp.id}`)}
              >
                <img 
                  src={exp.imagen}
                  alt={exp.titulo}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                />
                
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "35px 28px",
                  background: "linear-gradient(to top, rgba(2, 62, 138, 0.95), rgba(0, 119, 182, 0.7) 70%, transparent)",
                  color: "white"
                }}>
                  <h3 style={{ 
                    fontSize: "1.5rem", 
                    marginBottom: "10px",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: "600",
                    lineHeight: "1.3"
                  }}>
                    {exp.titulo}
                  </h3>
                  <p style={{ 
                    fontSize: "0.95rem", 
                    marginBottom: "18px",
                    opacity: 0.95,
                    fontFamily: "'Lora', Georgia, serif"
                  }}>
                    Starts ${exp.precio}
                  </p>
                  <button 
                    style={{
                      background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)",
                      color: "white",
                      border: "none",
                      padding: "12px 28px",
                      borderRadius: "25px",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(0, 180, 216, 0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 20px rgba(0, 180, 216, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(0, 180, 216, 0.3)";
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/detalles/${exp.id}`);
                    }}
                  >
                    viajar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
