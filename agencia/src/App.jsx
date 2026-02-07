import './styles/variables.css';
import './styles/base.css';
import 'animate.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import LandingPage from './components/landingPage.jsx';
import LoginForm from './components/login.jsx';
import Pagos from './components/pagos.jsx';
import Register from './components/registro.jsx';
import Cart from './components/cartContext/cart.jsx';
import Contacto from './components/contacto.jsx';
import Detalles from './components/detalles.jsx';
import { Destinos } from "./components/destinos.jsx";
import { CartProvider } from "./components/cartContext/cartContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <Routes>
            {/* Ruta para la página principal */}
            <Route path="/" element={<LandingPage />} />

            {/* Ruta para la página de login */}
            <Route path="/login" element={<LoginForm />} />

            {/* Ruta para la página de experiencias */}
            <Route path="/destinos" element={<Destinos />} />

              {/* Ruta para la página de detalles del viaje */}
            <Route path="/detalles" element={<Detalles />} />

            {/* Ruta para la página contacto */}
            <Route path="/contacto" element={<Contacto />} />

            {/* Ruta para la página pagos */}
            <Route path="/pagos" element={<Pagos />} />

            {/* Ruta para la página de registro */}
            <Route path="/registro" element={<Register />} />

            {/* Ruta para el carrito de compras */}
            <Route path="/carrito" element={<Cart />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
