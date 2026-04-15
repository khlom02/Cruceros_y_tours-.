import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  fetchReservasCliente,
  fetchSuscripcionCliente,
} from "../backend/supabase_client";
import "../styles/perfil.css";

const ESTADOS_LABEL = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  completada: "Completada",
};

export default function Perfil() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [suscripcion, setSuscripcion] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    pais: "",
    ciudad: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  // Cargar datos al montar
  useEffect(() => {
    if (!user) return;
    const loadAll = async () => {
      setLoadingData(true);
      const [profileData, reservasData, suscripcionData] = await Promise.all([
        getUserProfile(user.id),
        fetchReservasCliente(user.id),
        fetchSuscripcionCliente(user.id),
      ]);
      setProfile(profileData);
      setForm({
        nombre: profileData?.nombre || "",
        apellido: profileData?.apellido || "",
        telefono: profileData?.telefono || "",
        pais: profileData?.pais || "",
        ciudad: profileData?.ciudad || "",
      });
      setReservas(reservasData || []);
      setSuscripcion(suscripcionData || null);
      setLoadingData(false);
    };
    loadAll();
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const result = await updateUserProfile(user.id, form);
    setSaving(false);
    if (result) {
      setProfile((prev) => ({ ...prev, ...form }));
      setEditing(false);
      setMsg({ type: "success", text: "Perfil actualizado correctamente." });
    } else {
      setMsg({ type: "error", text: "Error al guardar. Intenta de nuevo." });
    }
  };

  if (authLoading || !user) return null;

  const displayName =
    profile?.nombre
      ? `${profile.nombre}${profile.apellido ? " " + profile.apellido : ""}`
      : user.email?.split("@")[0] || "Usuario";

  return (
    <div className="perfil-page">
      <div className="perfil-container">

        {/* ── Cabecera ── */}
        <div className="perfil-header">
          <div className="perfil-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="perfil-header__info">
            <h1 className="perfil-nombre">{displayName}</h1>
            <p className="perfil-email">{user.email}</p>
            {profile?.created_at && (
              <p className="perfil-desde">
                Miembro desde{" "}
                {new Date(profile.created_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            )}
          </div>
        </div>

        {/* ── Mensaje de feedback ── */}
        {msg && (
          <div className={`perfil-msg perfil-msg--${msg.type}`} role="alert">
            {msg.text}
          </div>
        )}

        {/* ── Datos personales ── */}
        <div className="perfil-card">
          <div className="perfil-card__head">
            <h2>Datos personales</h2>
            {!editing && !loadingData && (
              <button
                className="perfil-btn-edit"
                onClick={() => { setEditing(true); setMsg(null); }}
              >
                <i className="bi bi-pencil me-1"></i>Editar
              </button>
            )}
          </div>

          {loadingData ? (
            <p className="perfil-loading">Cargando...</p>
          ) : editing ? (
            <form className="perfil-form" onSubmit={handleSave}>
              <div className="perfil-form__grid">
                <div className="perfil-field">
                  <label htmlFor="pf-nombre">Nombre</label>
                  <input
                    id="pf-nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    maxLength={80}
                  />
                </div>
                <div className="perfil-field">
                  <label htmlFor="pf-apellido">Apellido</label>
                  <input
                    id="pf-apellido"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="Tu apellido"
                    maxLength={80}
                  />
                </div>
                <div className="perfil-field">
                  <label htmlFor="pf-telefono">Teléfono</label>
                  <input
                    id="pf-telefono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="+58 412 000 0000"
                    maxLength={30}
                  />
                </div>
                <div className="perfil-field">
                  <label htmlFor="pf-pais">País</label>
                  <input
                    id="pf-pais"
                    name="pais"
                    value={form.pais}
                    onChange={handleChange}
                    placeholder="Venezuela"
                    maxLength={60}
                  />
                </div>
                <div className="perfil-field">
                  <label htmlFor="pf-ciudad">Ciudad</label>
                  <input
                    id="pf-ciudad"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    placeholder="Caracas"
                    maxLength={60}
                  />
                </div>
              </div>
              <div className="perfil-form__actions">
                <button
                  type="submit"
                  className="perfil-btn-save"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  className="perfil-btn-cancel"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="perfil-info">
              <div className="perfil-info__item">
                <span className="perfil-info__label">Nombre</span>
                <span className="perfil-info__value">{profile?.nombre || "—"}</span>
              </div>
              <div className="perfil-info__item">
                <span className="perfil-info__label">Apellido</span>
                <span className="perfil-info__value">{profile?.apellido || "—"}</span>
              </div>
              <div className="perfil-info__item">
                <span className="perfil-info__label">Correo electrónico</span>
                <span className="perfil-info__value">{user.email}</span>
              </div>
              <div className="perfil-info__item">
                <span className="perfil-info__label">Teléfono</span>
                <span className="perfil-info__value">{profile?.telefono || "—"}</span>
              </div>
              <div className="perfil-info__item">
                <span className="perfil-info__label">País</span>
                <span className="perfil-info__value">{profile?.pais || "—"}</span>
              </div>
              <div className="perfil-info__item">
                <span className="perfil-info__label">Ciudad</span>
                <span className="perfil-info__value">{profile?.ciudad || "—"}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Mis reservas ── */}
        <div className="perfil-card">
          <div className="perfil-card__head">
            <h2>Mis consultas y reservas</h2>
          </div>
          {loadingData ? (
            <p className="perfil-loading">Cargando...</p>
          ) : reservas.length === 0 ? (
            <p className="perfil-empty">
              Aún no tienes solicitudes registradas.{" "}
              <a href="/destinos" className="perfil-link">Explora nuestros paquetes</a>
            </p>
          ) : (
            <div className="perfil-reservas">
              {reservas.map((r) => (
                <div className="perfil-reserva-item" key={r.id}>
                  <div className="perfil-reserva-item__info">
                    <span className="perfil-reserva-item__titulo">
                      {r.paquete_nombre}
                    </span>
                    <span className="perfil-reserva-item__meta">
                      {r.fecha_viaje
                        ? new Date(r.fecha_viaje).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Fecha por confirmar"}
                      {" · "}
                      {r.pasajeros}{" "}
                      {r.pasajeros === 1 ? "pasajero" : "pasajeros"}
                    </span>
                    {r.comentarios && (
                      <span className="perfil-reserva-item__comentario">
                        {r.comentarios}
                      </span>
                    )}
                  </div>
                  <span
                    className={`perfil-reserva-item__estado perfil-reserva-item__estado--${r.estado}`}
                  >
                    {ESTADOS_LABEL[r.estado] || r.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Mi suscripción ── */}
        <div className="perfil-card">
          <div className="perfil-card__head">
            <h2>Mi suscripción</h2>
            <a href="/suscripciones" className="perfil-btn-edit">Ver planes</a>
          </div>
          {loadingData ? (
            <p className="perfil-loading">Cargando...</p>
          ) : !suscripcion ? (
            <p className="perfil-empty">
              No tienes ningún plan activo.{" "}
              <a href="/suscripciones" className="perfil-link">Explorar planes</a>
            </p>
          ) : (
            <div className="perfil-suscripcion">
              <span className={`perfil-suscripcion__plan perfil-suscripcion__plan--${suscripcion.plan}`}>
                {suscripcion.plan.charAt(0).toUpperCase() + suscripcion.plan.slice(1)}
              </span>
              <span className={`perfil-reserva-item__estado perfil-reserva-item__estado--${
                suscripcion.estado === "pendiente_activacion" ? "pendiente" :
                suscripcion.estado === "activa" ? "confirmada" : "cancelada"
              }`}>
                {suscripcion.estado === "pendiente_activacion"
                  ? "Pendiente de activación"
                  : suscripcion.estado === "activa"
                  ? "Activa"
                  : "Cancelada"}
              </span>
              {suscripcion.fecha_inicio && (
                <span className="perfil-suscripcion__fecha">
                  Desde{" "}
                  {new Date(suscripcion.fecha_inicio).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
