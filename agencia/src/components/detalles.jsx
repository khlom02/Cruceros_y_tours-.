import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "./cartContext/cartContext.jsx";
import '../styles/detalles.css';

// Base de datos de destinos/experiencias
const experienciasData = {
  1: {
    title: "Private Vineyard Tour in Tuscany",
    location: "Tuscany, Italy",
    description: "Indulge in an exclusive vineyard tour through the rolling hills of Tuscany. Visit family-owned wineries, taste world-class Chianti wines, and enjoy authentic Italian cuisine prepared by local chefs. This intimate experience includes private transportation and a personal sommelier guide.",
    price: 1180,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80",
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
  2: {
    title: "Northern Lights Glamping",
    location: "Iceland",
    description: "Experience the magic of the Aurora Borealis from the comfort of a luxury heated dome. Located in Iceland's remote countryside, away from light pollution, this glamping experience offers the perfect vantage point for viewing nature's most spectacular light show.",
    price: 250,
    image: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=1200&q=80",
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
  3: {
    title: "Sunset Camel Trek in the Sahara",
    location: "Morocco",
    description: "Journey into the golden dunes of the Sahara Desert on a traditional camel trek. Watch the sun set over endless sand dunes, enjoy a traditional Berber dinner under the stars, and spend the night in an authentic desert camp complete with traditional music and storytelling.",
    price: 150,
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=80",
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
  4: {
    title: "Explore Angkor Wat",
    location: "Cambodia",
    description: "Discover the ancient temples of Angkor Wat with an expert archaeologist guide. Explore the largest religious monument in the world, learn about Khmer civilization, and witness sunrise over the iconic temple complex. This tour includes lesser-known temples and hidden jungle ruins.",
    price: 75,
    image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1200&q=80",
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
  5: {
    title: "Desert Safari Adventure",
    location: "Dubai, UAE",
    description: "Experience the thrill of dune bashing in a 4x4 vehicle, try sandboarding down massive dunes, and enjoy a traditional Arabian night at a desert camp. This adventure includes camel rides, henna painting, falconry displays, and a BBQ dinner with belly dancing entertainment.",
    price: 120,
    image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200&q=80",
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
  6: {
    title: "Taronga Helicopter Island Tour",
    location: "Sydney, Australia",
    description: "Soar above Sydney's iconic harbor in a luxury helicopter tour. Enjoy breathtaking aerial views of the Opera House, Harbour Bridge, and pristine beaches. Land on a secluded island for a gourmet picnic lunch and swimming in crystal-clear waters before returning via scenic coastal route.",
    price: 300,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    weather: { temp: 26, condition: "Sunny", location: "Sydney" },
    included: [
      { icon: "🚁", title: "Helicopter Tour", description: "Luxury flight" },
      { icon: "🏝️", title: "Island Landing", description: "Private beach" },
      { icon: "🍽️", title: "Gourmet Picnic", description: "Chef-prepared" },
      { icon: "🏊", title: "Swimming", description: "Pristine waters" },
      { icon: "📸", title: "Aerial Photos", description: "Professional shots" },
      { icon: "🥂", title: "Champagne", description: "Celebration toast" }
    ]
  },
  // Destino por defecto (Amalfi Coast)
  default: {
    title: "Amalfi Coast, Italy",
    location: "Amalfi Coast, Italy",
    description: "The Amalfi Coast is a Mediterranean paradise, where steep cliffs adorned with colorful villages meet the azure sea. Experience the charm of Positano, the tranquility of Amalfi, and the breathtaking views along winding coastal roads in one of Italy's most picturesque settings.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=1200&q=80",
    weather: { temp: 25, condition: "Sunny", location: "Amalfi" },
    included: [
      { icon: "🛏️", title: "Luxury Stay", description: "5-star hotels" },
      { icon: "✈️", title: "Flights & Transfers", description: "Round trip included" },
      { icon: "ℹ️", title: "Guided Tours", description: "Expert local guides" },
      { icon: "📍", title: "Top Attractions", description: "Skip-the-line access" },
      { icon: "👨‍🍳", title: "Gourmet Meals", description: "Authentic cuisine" },
      { icon: "🍽️", title: "Fine Dining", description: "Michelin restaurants" }
    ]
  }
};

const Detalles = () => {
  const { agregarAlCarrito } = useCart();
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID de la URL
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [destinationData, setDestinationData] = useState(null);

  useEffect(() => {
    // Cargar datos basados en el ID
    if (id && experienciasData[id]) {
      setDestinationData(experienciasData[id]);
    } else {
      // Si no hay ID o no existe, usar el destino por defecto
      setDestinationData(experienciasData.default);
    }
  }, [id]);

  if (!destinationData) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Cargando...</h2>
        </div>
      </div>
    );
  }

  const handleSecureSpot = () => {
    if (!selectedDate) {
      alert("Por favor selecciona una fecha para tu viaje");
      return;
    }

    const bookingData = {
      id: Date.now(),
      nombre: destinationData.title,
      imagen: destinationData.image,
      precio: destinationData.price,
      cantidad: adults + children,
      fecha: selectedDate,
      adultos: adults,
      ninos: children
    };

    agregarAlCarrito(bookingData);
    navigate("/carrito");
  };

  return (
    <div className="detalles-page">
      {/* Breadcrumb */}
      <div className="container pt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb-detalles">
            <li className="breadcrumb-item">
              <Link to="/">🏠 Destinations</Link>
            </li>
            <li className="breadcrumb-item active">{destinationData.location}</li>
          </ol>
        </nav>
      </div>

      {/* Hero Image */}
      <div className="container my-4">
        <div className="hero-image-container">
          <img 
            src={destinationData.image} 
            alt={destinationData.title}
            className="hero-image"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container pb-5">
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8">
            <h1 className="destination-title">{destinationData.title}</h1>
            <p className="destination-description">{destinationData.description}</p>

            {/* Weather Widget */}
            <div className="weather-widget">
              <div className="weather-icon">☀️</div>
              <div className="weather-info">
                <div className="weather-condition">{destinationData.weather.condition}</div>
                <div className="weather-temp">{destinationData.weather.temp}°C</div>
                <div className="weather-location">Current weather in {destinationData.weather.location}</div>
              </div>
            </div>

            {/* What's Included */}
            <div className="whats-included-section">
              <h2 className="section-title">What's Included</h2>
              <div className="row g-4">
                {destinationData.included.map((item, index) => (
                  <div key={index} className="col-md-4">
                    <div className="included-card">
                      <div className="included-icon">{item.icon}</div>
                      <h3 className="included-title">{item.title}</h3>
                      <p className="included-description">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="col-lg-4">
            <div className="booking-card">
              <div className="booking-price">
                <span className="price-label">From</span>
                <span className="price-amount">${destinationData.price.toLocaleString()}</span>
                <span className="price-per">/ person</span>
              </div>

              <div className="booking-form">
                <label className="form-label">Trip Dates</label>
                <input 
                  type="date" 
                  className="form-control date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />

                <div className="travelers-section">
                  <label className="form-label">Travelers</label>
                  <div className="travelers-input">
                    <div className="traveler-row">
                      <span>Adults</span>
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                        >
                          -
                        </button>
                        <span className="qty-value">{adults}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => setAdults(adults + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="traveler-row">
                      <span>Children</span>
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                        >
                          -
                        </button>
                        <span className="qty-value">{children}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => setChildren(children + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="travelers-summary">
                    {adults} Adult{adults !== 1 ? 's' : ''} • {children} Child{children !== 1 ? 'ren' : ''}
                  </div>
                </div>

                <button 
                  className="btn-secure-spot"
                  onClick={handleSecureSpot}
                >
                  Secure Your Spot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detalles;
