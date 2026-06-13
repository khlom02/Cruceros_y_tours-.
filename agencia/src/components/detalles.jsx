import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from './SEO.jsx';
import "../styles/detalles.css";
import { fetchProductById, fetchSpecialServiceByKey } from "../backend/supabase_client";
import { useAuth } from "../contexts/AuthContext";
import ProductHero from "./ProductHero.jsx";
import AnchorNav from "./AnchorNav.jsx";
import InfoSection from "./InfoSection.jsx";
import Timeline from "./Timeline.jsx";
import Rooms from "./rooms.jsx";
import StickyBookingBar from "./StickyBookingBar.jsx";
import MobileStickyBar from "./MobileStickyBar.jsx";

const normalizeDetalle = (data) => {
    if (!data) return null;

    const dbGallery = Array.isArray(data.gallery) ? data.gallery : [];
    const mainImage = data.imagen || data.imagen_url;
    const gallery = mainImage
      ? [mainImage, ...dbGallery]
      : dbGallery;

    return {
        id: data.id,
        title: data.titulo || data.title || "",
        location: data.ubicacion || data.location || "",
        rating: data.rating ?? null,
        reviews: data.cantidad_reviews ?? data.reviews ?? null,
        description: data.descripcion || data.description || "",
        amenities: Array.isArray(data.amenities) ? data.amenities.map(a => a.nombre || a) : [],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        facilities: Array.isArray(data.amenities) ? data.amenities.map(a => `${a.icono_emoji || '•'} ${a.nombre || a}`) : [],
        rooms: Array.isArray(data.rooms) ? data.rooms : [],
        anosServicio: data.detalles_crucero?.anos_servicio ?? data.anos_servicio ?? null,
        pasajerosMax: data.detalles_crucero?.pasajeros_max ?? data.pasajeros_max ?? null,
        tripulantes: data.detalles_crucero?.tripulantes ?? null,
        ratioEspacio: data.detalles_crucero?.ratio_espacio ?? data.ratio_espacio ?? null,
        ratioServicio: data.detalles_crucero?.ratio_servicio ?? data.ratio_servicio ?? null,
        cabinaSingle: data.detalles_crucero?.cabina_single ?? data.cabina_single ?? false,
        viajandoConNinos: data.detalles_crucero?.viajando_con_ninos ?? data.viajando_con_ninos ?? false,
        gallery,
        itinerarios: Array.isArray(data.itinerarios) ? data.itinerarios : [],
    };
};

const serviceTypes = ["tren", "auto", "asistencia"];

const normalizeServiceDetalle = (data) => {
    if (!data) return null;

    const dbGallery = Array.isArray(data.gallery) ? data.gallery : [];
    const mainImage = data.imagen_url;
    const gallery = mainImage
      ? [mainImage, ...dbGallery]
      : dbGallery;

    return {
        id: data.id,
        tipo: data.tipo || "",
        title: data.nombre || data.title || "",
        location: data.ubicacion || data.location || "",
        rating: data.rating ?? null,
        reviews: data.reviews ?? null,
        description: data.descripcion || data.description || "",
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        serviceInfo: Array.isArray(data.serviceInfo)
            ? data.serviceInfo
            : Array.isArray(data.service_info)
                ? data.service_info
                : [],
        gallery,
    };
};

const Detalles = () => {
    const [searchParams] = useSearchParams();
    const detalleId = searchParams.get("id");
    const detalleTipo = searchParams.get("tipo");
    const isSpecialService = serviceTypes.includes(detalleTipo);
    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            if (!detalleId && !isSpecialService) {
                if (!mounted) return;
                setDetalle(null);
                setError("Selecciona una experiencia para ver sus detalles.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            const data = isSpecialService
                ? await fetchSpecialServiceByKey({ id: detalleId, tipo: detalleTipo })
                : await fetchProductById(detalleId);

            if (!mounted) return;

            if (!data) {
                setDetalle(null);
                setError("No se encontró el detalle solicitado en la base de datos.");
                setLoading(false);
                return;
            }

            const normalized = isSpecialService
                ? normalizeServiceDetalle(data)
                : normalizeDetalle(data);

            setDetalle(normalized);
            setLoading(false);
        };

        load();

        return () => { mounted = false; };
    }, [detalleId, detalleTipo, isSpecialService]);

    if (loading) {
        return (
            <div className="detalles-page">
                <div className="detalles-state">Cargando detalles...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detalles-page">
                <div className="detalles-state">{error}</div>
            </div>
        );
    }

    if (!detalle) {
        return (
            <div className="detalles-page">
                <div className="detalles-state">No hay informacion disponible.</div>
            </div>
        );
    }

    const hasRooms = detalle.rooms?.length > 0 || isSpecialService;
    const hasItinerarios = detalle.itinerarios?.length > 0;
    const hasFacilities = detalle.facilities?.length > 0;

    const visibleSections = {
        "seccion-info": true,
        "seccion-cabinas": hasRooms,
        "seccion-itinerario": hasItinerarios,
        "seccion-instalaciones": hasFacilities,
    };

    return (
        <>
            <SEO
                title={detalle.title}
                description={(detalle.description || "").substring(0, 160) || `Información detallada sobre ${detalle.title}.`}
                canonical={`/detalles?id=${detalleId}${detalleTipo ? `&tipo=${detalleTipo}` : ''}`}
                image={detalle?.gallery?.[0] || undefined}
            />
            <div className="detalles-page">
                <ProductHero detalle={detalle} />
                <AnchorNav visibleSections={visibleSections} />
                <div className="detalles-grid">
                    <div className="detalles-content">
                        <InfoSection
                            detalle={detalle}
                            detalleTipo={detalleTipo}
                            isSpecialService={isSpecialService}
                        />

                        {hasRooms && (
                            <div id="seccion-cabinas">
                                <Rooms
                                    serviceType={isSpecialService ? detalleTipo : ""}
                                    rooms={!isSpecialService ? detalle.rooms : undefined}
                                    title={
                                        isSpecialService
                                            ? "Nuestros socios"
                                            : detalle.rooms?.length > 0
                                                ? "Cabinas y opciones disponibles"
                                                : ""
                                    }
                                    subtitle={
                                        isSpecialService
                                            ? "Selecciona la alternativa que mejor se ajuste a tu plan."
                                            : detalle.rooms?.length > 0
                                                ? "Elige la opcion que mejor se adapte a tu viaje."
                                                : ""
                                    }
                                />
                            </div>
                        )}

                        {hasItinerarios && (
                            <div id="seccion-itinerario">
                                <Timeline itinerarios={detalle.itinerarios} />
                            </div>
                        )}

                        {hasFacilities && (
                            <section id="seccion-instalaciones" className="detalles-section">
                                <h2>Instalaciones</h2>
                                <div className="detalles-facilities">
                                    {detalle.facilities.map((facility, index) => (
                                        <div
                                            key={`${detalle.id}-facility-${index}`}
                                            className="detalles-facility"
                                        >
                                            {facility}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="detalles-sidebar">
                        <div id="seccion-reserva">
                            <StickyBookingBar user={user} detalle={detalle} />
                        </div>
                    </div>
                </div>
            </div>
            <MobileStickyBar detalle={detalle} />
        </>
    );
};

export default Detalles;
