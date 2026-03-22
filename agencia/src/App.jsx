import './App.css';
import './styles/variables.css';
import './styles/base.css';
import 'animate.css';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResetPassword from './components/ResetPassword.jsx';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import LandingPage from './components/landingPage.jsx';
import LoginForm from './components/login.jsx';
import Register from './components/registro.jsx';
import Contacto from './components/contacto.jsx';
import Detalles from './components/detalles.jsx';
import { Destinos } from "./components/destinos.jsx";
import Cruceros from "./components/Cruceros.jsx";
import ServiciosEspeciales from "./components/servicios_especiales.jsx";
import ServicioCategoria from "./components/ServicioCategoria.jsx";
import Vuelos from "./components/vuelos.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

export default function App() {
  return (
    <HelmetProvider>
    <AuthProvider>
        <Router>
          <Header />
          <Routes>
            {/* Ruta para la página principal */}
            <Route path="/" element={<LandingPage />} />

            {/* Ruta para la página de login */}
            <Route path="/login" element={<LoginForm />} />

            {/* Ruta para la página de experiencias */}
            <Route path="/destinos" element={<Destinos />} />

            {/* Ruta para la página de cruceros */}
            <Route path="/cruceros" element={<Cruceros />} />

            {/* Ruta para la página de vuelos */}
            <Route path="/vuelos" element={<Vuelos />} />

            {/* Ruta para la página de servicios especiales */}
            <Route path="/servicios_especiales" element={<ServiciosEspeciales />} />

            {/* Subrutas dinamicas: /servicios_especiales/trenes | vehiculos | asistencia */}
            <Route path="/servicios_especiales/:categoria" element={<ServicioCategoria />} />

              {/* Ruta para la página de detalles del viaje */}
            <Route path="/detalles" element={<Detalles />} />

            {/* Ruta para la página contacto */}
            <Route path="/contacto" element={<Contacto />} />

            {/* Ruta para la página de registro */}
            <Route path="/registro" element={<Register />} />

            {/* Ruta para restablecer contraseña (destino del email de Supabase) */}
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Ruta 404 — cualquier URL desconocida redirige al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* Ruta para el panel de administracion */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
          </Routes>
          <Footer />
        </Router>
    </AuthProvider>
    </HelmetProvider>
  );
}
