import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/autoLogout.css";

const INACTIVIDAD_MAX_MS = 30 * 60 * 1000;
const AVISO_MS = 2 * 60 * 1000;
const CHECK_INTERVAL_MS = 30_000;

export default function AutoLogout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const ultimaActividadRef = useRef(0);
  const mostrarAvisoRef = useRef(false);

  useEffect(() => {
    mostrarAvisoRef.current = mostrarAviso;
  }, [mostrarAviso]);

  const reiniciarTimer = useCallback(() => {
    ultimaActividadRef.current = Date.now();
    setSegundosRestantes(Math.ceil(INACTIVIDAD_MAX_MS / 1000));
    if (mostrarAvisoRef.current) setMostrarAviso(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    ultimaActividadRef.current = Date.now();

    const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    eventos.forEach((ev) => window.addEventListener(ev, reiniciarTimer));

    const interval = setInterval(() => {
      const ahora = Date.now();
      const inactividad = ahora - ultimaActividadRef.current;
      const tiempoRestante = INACTIVIDAD_MAX_MS - inactividad;

      setSegundosRestantes(Math.max(0, Math.ceil(tiempoRestante / 1000)));

      if (inactividad >= INACTIVIDAD_MAX_MS) {
        signOut();
        navigate("/login");
        return;
      }

      if (tiempoRestante <= AVISO_MS && !mostrarAvisoRef.current) {
        setMostrarAviso(true);
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      eventos.forEach((ev) => window.removeEventListener(ev, reiniciarTimer));
      clearInterval(interval);
    };
  }, [user, signOut, navigate, reiniciarTimer]);

  if (!mostrarAviso || !user) return null;

  return (
    <div className="auto-logout" role="alert">
      <p className="auto-logout__title">
        Sesión por expirar
      </p>
      <p className="auto-logout__text">
        {segundosRestantes > 60
          ? `Por inactividad, tu sesión cerrará en ${Math.ceil(segundosRestantes / 60)} min.`
          : `Por inactividad, tu sesión cerrará en ${segundosRestantes} seg.`}
      </p>
      <button type="button" className="auto-logout__button" onClick={reiniciarTimer}>
        Seguir navegando
      </button>
    </div>
  );
}
