import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/admin.css";
import {
  supabase,
  fetchCategories,
  fetchAllProductsAdmin,
  fetchProductAdminById,
  deleteProductAndRelated,
  fetchContactosAdmin,
  updateContactoEstado,
  fetchReservasAdmin,
  updateReservaEstado,
  fetchSuscripcionesAdmin,
  updateSuscripcionEstado,
} from "../backend/supabase_client";

// ─── Nombre del bucket de Supabase Storage donde se guardan las imagenes ───
const BUCKET_NAME = "content media";

// ─── Tipos permitidos y tamaño máximo para archivos ────────────────────────
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANO_MAX_MB = 5;

// ─── Validar y convertir números de manera segura ─────────────────────────
const parseNumber = (value) => {
  if (!value || value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  // Validar que sea un número válido
  if (isNaN(num) || !isFinite(num)) return null;
  // Limitar a números razonables (evitar overflow)
  if (Math.abs(num) > 999999999) return null;
  return num;
};

function validarArchivo(file) {
  if (!TIPOS_PERMITIDOS.includes(file.type)) {
    throw new Error("Solo se permiten imágenes en formato JPG, PNG, WEBP o GIF.");
  }
  if (file.size > TAMANO_MAX_MB * 1024 * 1024) {
    throw new Error(`El archivo no debe superar ${TAMANO_MAX_MB}MB.`);
  }
}

// ─── Plantillas vacias para cada item de lista dinamica ─────────────────────
const emptyRoom = { titulo: "", descripcion: "", precio: "", imagenFile: null, existingImageUrl: null };
const emptyHighlight = { descripcion: "" };

// ─── Emojis para amenities (viajes / alojamiento) ────────────────────────────
const EMOJIS_TRAVEL = [
  "🏊","🍽️","🍷","💆","🏋️","📶","🎭","🅿️","🌊","⛵","❄️","🧺",
  "🎪","🌿","🚌","💳","📺","☕","🍳","🚿","🛁","🏖️","🎵","👶",
  "🎰","⚓","🧴","🔒","🌅","🛎️","🎯","🚢","✈️","🏝️","🌴","🏄",
  "🤿","🎿","🧘","🎬","🌺","💐","🍦","🎠","🎡","🎋","⛳","🎾",
  "🏌️","🧗","🛶","🌄","🌃","🎆","🥂","🍾","🎁","🌐","🗺️","🧭",
];

// ─── Lista predefinida de amenities con nombre + emoji ────────────────────────
const AMENITIES_PREDEFINIDOS = [
  { nombre: "Piscina", icono_emoji: "🏊" },
  { nombre: "Restaurante", icono_emoji: "🍽️" },
  { nombre: "Bar / Vino", icono_emoji: "🍷" },
  { nombre: "Spa", icono_emoji: "💆" },
  { nombre: "Gimnasio", icono_emoji: "🏋️" },
  { nombre: "WiFi", icono_emoji: "📶" },
  { nombre: "Teatro / Shows", icono_emoji: "🎭" },
  { nombre: "Estacionamiento", icono_emoji: "🅿️" },
  { nombre: "Deportes acuáticos", icono_emoji: "🌊" },
  { nombre: "Excursiones en velero", icono_emoji: "⛵" },
  { nombre: "Aire acondicionado", icono_emoji: "❄️" },
  { nombre: "Lavandería", icono_emoji: "🧺" },
  { nombre: "Entretenimiento", icono_emoji: "🎪" },
  { nombre: "Jardines / Áreas verdes", icono_emoji: "🌿" },
  { nombre: "Traslados incluidos", icono_emoji: "🚌" },
  { nombre: "Todo incluido", icono_emoji: "💳" },
  { nombre: "Smart TV", icono_emoji: "📺" },
  { nombre: "Café / Desayuno", icono_emoji: "☕" },
  { nombre: "Cocina equipada", icono_emoji: "🍳" },
  { nombre: "Ducha", icono_emoji: "🚿" },
  { nombre: "Bañera", icono_emoji: "🛁" },
  { nombre: "Playa privada", icono_emoji: "🏖️" },
  { nombre: "Música en vivo", icono_emoji: "🎵" },
  { nombre: "Área para niños", icono_emoji: "👶" },
  { nombre: "Casino", icono_emoji: "🎰" },
  { nombre: "Marina / Puerto deportivo", icono_emoji: "⚓" },
  { nombre: "Amenities de tocador", icono_emoji: "🧴" },
  { nombre: "Caja fuerte", icono_emoji: "🔒" },
  { nombre: "Vista panorámica", icono_emoji: "🌅" },
  { nombre: "Servicio a la habitación", icono_emoji: "🛎️" },
  { nombre: "Actividades dirigidas", icono_emoji: "🎯" },
  { nombre: "Vuelos incluidos", icono_emoji: "✈️" },
  { nombre: "Isla privada", icono_emoji: "🏝️" },
  { nombre: "Snorkel / Buceo", icono_emoji: "🤿" },
  { nombre: "Surf", icono_emoji: "🏄" },
  { nombre: "Yoga / Meditación", icono_emoji: "🧘" },
  { nombre: "Cine a bordo", icono_emoji: "🎬" },
  { nombre: "Golf", icono_emoji: "⛳" },
  { nombre: "Tenis", icono_emoji: "🎾" },
  { nombre: "Escalada", icono_emoji: "🧗" },
  { nombre: "Kayak / Remo", icono_emoji: "🛶" },
  { nombre: "Ski acuático", icono_emoji: "🎿" },
];


const productoInicial = {
  titulo: "",
  descripcion: "",
  precio: "",
  ubicacion: "",
  rating: "",
  cantidad_reviews: "",
  fecha_inicio: "",
  fecha_fin: "",
  color_fondo: "verde",
  categoria_id: "",
  activo: true,
  imagenFile: null,
  imagen: "", // URL existente (solo en modo edicion)
};

const detalleInicial = {
  anos_servicio: "",
  pasajeros_max: "",
  tripulantes: "",
  ratio_espacio: "",
  ratio_servicio: "",
  cabina_single: false,
  viajando_con_ninos: false,
};

const AdminPanel = () => {

  // ─── Tabs ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("crear");

  // ─── Estado general del formulario ────────────────────────────────────────
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null); // { titulo, categoria, ruta, modo }
  const [fieldErrors, setFieldErrors] = useState({}); // Rastrear errores por campo

  // ─── Modo edicion ─────────────────────────────────────────────────────────
  const [editingProductId, setEditingProductId] = useState(null);

  // ─── Lista de productos (tab Gestionar) ───────────────────────────────────
  const [productosLista, setProductosLista] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ─── Contactos (tab Contactos) ────────────────────────────────────────────
  const [contactosList, setContactosList] = useState([]);
  const [loadingContactos, setLoadingContactos] = useState(false);
  const [contactoExpandido, setContactoExpandido] = useState(null);

  // ─── Reservas (tab Reservas) ──────────────────────────────────────────────
  const [reservasList, setReservasList] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(false);

  // ─── Suscripciones (tab Suscripciones) ───────────────────────────────────
  const [suscripcionesList, setSuscripcionesList] = useState([]);
  const [loadingSuscripciones, setLoadingSuscripciones] = useState(false);

  // ─── Campos del producto principal ────────────────────────────────────────
  const [producto, setProducto] = useState(productoInicial);

  // ─── Campos extra solo para cruceros (tabla detalles_cruceros) ───────────
  const [detalleCrucero, setDetalleCrucero] = useState(detalleInicial);

  // ─── Listas dinamicas: galeria, rooms, amenities, highlights ─────────────
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [rooms, setRooms] = useState([{ ...emptyRoom }]);
  const [amenities, setAmenities] = useState([]);
  const [highlights, setHighlights] = useState([{ ...emptyHighlight }]);

  // ─── Galeria existente (modo edicion) ────────────────────────────────────
  const [existingGallery, setExistingGallery] = useState([]); // [{ id, imagen_url }]
  const [galleryToDelete, setGalleryToDelete] = useState([]);  // IDs a borrar al guardar

  // ─── Selector de amenities: dropdown predefinidos y picker custom ────────
  const [showPredefinedDropdown, setShowPredefinedDropdown] = useState(false);
  const [customAmenity, setCustomAmenity] = useState({ nombre: "", icono_emoji: "" });
  const [showCustomEmojiPicker, setShowCustomEmojiPicker] = useState(false);

  // ─── Guard contra doble submit ────────────────────────────────────────────
  const submittingRef = useRef(false);

  // ─── Carga las categorias desde Supabase al montar el componente ─────────
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategorias(data || []);
    };
    loadCategories();
  }, []);

  // ─── Carga los productos al abrir la tab Gestionar ────────────────────────
  useEffect(() => {
    if (activeTab === "gestionar") loadProductosAdmin();
    if (activeTab === "contactos") loadContactos();
    if (activeTab === "reservas") loadReservas();
    if (activeTab === "suscripciones") loadSuscripciones();
  }, [activeTab]);

  const loadContactos = async () => {
    setLoadingContactos(true);
    try {
      const data = await fetchContactosAdmin();
      setContactosList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContactos(false);
    }
  };

  const handleContactoEstado = async (id, nuevoEstado) => {
    await updateContactoEstado(id, nuevoEstado);
    setContactosList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
    );
  };

  const loadReservas = async () => {
    setLoadingReservas(true);
    try {
      const data = await fetchReservasAdmin();
      setReservasList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReservas(false);
    }
  };

  const handleReservaEstado = async (id, nuevoEstado) => {
    await updateReservaEstado(id, nuevoEstado);
    setReservasList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
    );
  };

  const loadSuscripciones = async () => {
    setLoadingSuscripciones(true);
    try {
      const data = await fetchSuscripcionesAdmin();
      setSuscripcionesList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuscripciones(false);
    }
  };

  const handleSuscripcionEstado = async (id, nuevoEstado) => {
    await updateSuscripcionEstado(id, nuevoEstado);
    setSuscripcionesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
    );
  };

  const loadProductosAdmin = async () => {
    setLoadingLista(true);
    try {
      const data = await fetchAllProductsAdmin();
      setProductosLista(data || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los productos.");
    } finally {
      setLoadingLista(false);
    }
  };

  // ─── Nombre legible de la categoria seleccionada ─────────────────────────
  const categoriaNombre = useMemo(() => {
    return categorias.find((cat) => String(cat.id) === String(producto.categoria_id))?.nombre || "";
  }, [categorias, producto.categoria_id]);

  // Muestra la seccion de detalles solo si la categoria es "cruceros"
  const isCrucero = categoriaNombre.toLowerCase() === "cruceros";

  // ─── Mapeo de categoria → ruta de la app ─────────────────────────────────
  const rutaPorCategoria = (nombre) => {
    const n = nombre.toLowerCase();
    if (n.includes("crucero")) return "/cruceros";
    if (n.includes("nacional")) return "/ (landing · Destinos Nacionales)";
    if (n.includes("internacional")) return "/ (landing · Destinos Internacionales)";
    if (n.includes("tren")) return "/servicios_especiales/trenes";
    if (n.includes("vehículo") || n.includes("vehiculo") || n.includes("auto")) return "/servicios_especiales/vehiculos";
    if (n.includes("asistencia")) return "/servicios_especiales/asistencia";
    if (n.includes("tour") || n.includes("destino")) return "/destinos";
    if (n.includes("vuelo") || n.includes("aerol")) return "/vuelos";
    return "/destinos";
  };

  // ─── Handlers de cambio de campo ──────────────────────────────────────────
  const handleProductoChange = (field, value) => {
    setProducto((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDetalleChange = (field, value) => {
    setDetalleCrucero((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Helpers para listas dinamicas ────────────────────────────────────────
  const updateListItem = (setter, index, field, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addListItem = (setter, item) => {
    setter((prev) => [...prev, { ...item }]);
  };

  const removeListItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Sube un archivo a Supabase Storage y retorna la URL publica ──────────
  const uploadFile = async (file, folder) => {
    validarArchivo(file);
    const ext = file.name.split(".").pop().replace(/[^a-z0-9]/gi, "").toLowerCase();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `${folder}/${fileName}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  // ─── Limpia todos los campos del formulario ────────────────────────────────
  const resetForm = () => {
    setProducto(productoInicial);
    setDetalleCrucero(detalleInicial);
    setGalleryFiles([]);
    setRooms([{ ...emptyRoom }]);
    setAmenities([]);
    setHighlights([{ ...emptyHighlight }]);
    setExistingGallery([]);
    setGalleryToDelete([]);
    setShowPredefinedDropdown(false);
    setCustomAmenity({ nombre: "", icono_emoji: "" });
    setShowCustomEmojiPicker(false);
    setEditingProductId(null);
    setFieldErrors({});
    setError("");
    submittingRef.current = false;
  };

  // ─── Cargar producto en el formulario para edicion ────────────────────────
  const handleEdit = async (productId) => {
    setError("");
    setSuccess(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const data = await fetchProductAdminById(productId);
      if (!data) throw new Error("Producto no encontrado");

      setProducto({
        titulo: data.titulo || "",
        descripcion: data.descripcion || "",
        precio: String(data.precio ?? ""),
        ubicacion: data.ubicacion || "",
        rating: data.rating != null ? String(data.rating) : "",
        cantidad_reviews: data.cantidad_reviews != null ? String(data.cantidad_reviews) : "",
        fecha_inicio: data.fecha_inicio || "",
        fecha_fin: data.fecha_fin || "",
        color_fondo: data.color_fondo || "verde",
        categoria_id: String(data.categoria_id || ""),
        activo: data.activo !== false,
        imagenFile: null,
        imagen: data.imagen || "",
      });

      setDetalleCrucero(
        data.detalles_crucero
          ? {
              anos_servicio: data.detalles_crucero.anos_servicio != null ? String(data.detalles_crucero.anos_servicio) : "",
              pasajeros_max: data.detalles_crucero.pasajeros_max != null ? String(data.detalles_crucero.pasajeros_max) : "",
              tripulantes: data.detalles_crucero.tripulantes != null ? String(data.detalles_crucero.tripulantes) : "",
              ratio_espacio: data.detalles_crucero.ratio_espacio != null ? String(data.detalles_crucero.ratio_espacio) : "",
              ratio_servicio: data.detalles_crucero.ratio_servicio != null ? String(data.detalles_crucero.ratio_servicio) : "",
              cabina_single: data.detalles_crucero.cabina_single || false,
              viajando_con_ninos: data.detalles_crucero.viajando_con_ninos || false,
            }
          : detalleInicial
      );

      setRooms(
        data.rooms.length > 0
          ? data.rooms.map((r) => ({
              titulo: r.titulo || "",
              descripcion: r.descripcion || "",
              precio: String(r.precio ?? ""),
              imagenFile: null,
              existingImageUrl: r.imagen_url || null,
            }))
          : [{ ...emptyRoom }]
      );

      setAmenities(
        data.amenities.length > 0
          ? data.amenities.map((a) => ({ nombre: a.nombre || "", icono_emoji: a.icono_emoji || "" }))
          : []
      );

      setHighlights(
        data.highlights.length > 0
          ? data.highlights.map((h) => ({ descripcion: h.descripcion || "" }))
          : [{ ...emptyHighlight }]
      );

      setGalleryFiles([]);
      setEditingProductId(productId);
      setActiveTab("crear");
    } catch (err) {
      setError("Error al cargar el producto para edicion.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Eliminar producto ────────────────────────────────────────────────────
  const handleDelete = async (productId) => {
    setLoading(true);
    const ok = await deleteProductAndRelated(productId);
    setLoading(false);

    if (ok) {
      setProductosLista((prev) => prev.filter((p) => p.id !== productId));
      setConfirmDeleteId(null);
    } else {
      setError("Error al eliminar el producto.");
    }
  };

  // ─── Envio del formulario: crear o actualizar ──────────────────────────────
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(null);
    const newFieldErrors = {};

    // Validaciones básicas
    if (!producto.titulo || !producto.titulo.trim()) {
      newFieldErrors.titulo = true;
      setError("El título es obligatorio.");
    }

    if (!producto.categoria_id) {
      newFieldErrors.categoria_id = true;
      setError("Debes seleccionar una categoría.");
    }

    if (!producto.precio || Number(producto.precio) <= 0) {
      newFieldErrors.precio = true;
      setError("El precio es obligatorio y debe ser mayor a 0.");
    }

    // Validar que los números sean válidos (no NaN, no infinitos)
    if (producto.rating && isNaN(Number(producto.rating))) {
      newFieldErrors.rating = true;
      setError("El rating debe ser un número válido.");
    }

    if (producto.rating && Number(producto.rating) > 10) {
      newFieldErrors.rating = true;
      setError("El rating no puede ser mayor a 10.");
    }

    if (producto.cantidad_reviews && isNaN(Number(producto.cantidad_reviews))) {
      newFieldErrors.cantidad_reviews = true;
      setError("La cantidad de reviews debe ser un número válido.");
    }

    if (producto.cantidad_reviews && Number(producto.cantidad_reviews) > 999999) {
      newFieldErrors.cantidad_reviews = true;
      setError("La cantidad de reviews es demasiado grande (máximo 999,999).");
    }

    if (producto.precio && Number(producto.precio) > 999999) {
      newFieldErrors.precio = true;
      setError("El precio es demasiado grande (máximo 999,999).");
    }

    // Validación adicional: verificar que categoria_id tenga un valor válido
    const parsedCategoryId = parseNumber(producto.categoria_id);
    if (!parsedCategoryId) {
      newFieldErrors.categoria_id = true;
      setError("Categoría inválida. Por favor selecciona una categoría válida.");
    }

    // En modo crear, la imagen es obligatoria. En edicion es opcional (se mantiene la existente)
    if (!editingProductId && !producto.imagenFile) {
      newFieldErrors.imagenFile = true;
      setError("Debes subir una imagen principal.");
    }

    // Si hay errores, mostrarlos y salir
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    // Limpiar errores si pasa validación
    setFieldErrors({});

    // Limpiar errores si pasa validación
    setFieldErrors({});

    try {
      setLoading(true);

      // ── MODO EDICION ──────────────────────────────────────────────────────
      if (editingProductId) {
        const imagenUrl = producto.imagenFile
          ? await uploadFile(producto.imagenFile, "productos")
          : producto.imagen;

        const { error: updateError } = await supabase
          .from("productos")
          .update({
            titulo: producto.titulo,
            descripcion: producto.descripcion,
            precio: parseNumber(producto.precio),
            imagen: imagenUrl,
            ubicacion: producto.ubicacion,
            rating: parseNumber(producto.rating),
            cantidad_reviews: parseNumber(producto.cantidad_reviews),
            fecha_inicio: producto.fecha_inicio || null,
            fecha_fin: producto.fecha_fin || null,
            color_fondo: producto.color_fondo,
            categoria_id: parseNumber(producto.categoria_id),
            activo: Boolean(producto.activo),
          })
          .eq("id", editingProductId);

        if (updateError) throw updateError;

        // Upsert detalles crucero
        if (isCrucero) {
          const { data: existeDetalle } = await supabase
            .from("detalles_cruceros")
            .select("id")
            .eq("producto_id", editingProductId)
            .maybeSingle();

          const detallePayload = {
            producto_id: editingProductId,
            anos_servicio: parseNumber(detalleCrucero.anos_servicio),
            pasajeros_max: parseNumber(detalleCrucero.pasajeros_max),
            tripulantes: parseNumber(detalleCrucero.tripulantes),
            ratio_espacio: parseNumber(detalleCrucero.ratio_espacio),
            ratio_servicio: parseNumber(detalleCrucero.ratio_servicio),
            cabina_single: detalleCrucero.cabina_single,
            viajando_con_ninos: detalleCrucero.viajando_con_ninos,
          };

          if (existeDetalle) {
            await supabase
              .from("detalles_cruceros")
              .update(detallePayload)
              .eq("producto_id", editingProductId);
          } else {
            await supabase.from("detalles_cruceros").insert(detallePayload);
          }
        }

        // Reemplazar rooms: borrar y reinsertar
        await supabase.from("rooms").delete().eq("producto_id", editingProductId);
        const roomsValidos = rooms.filter((r) => r.titulo && r.titulo.trim());
        if (roomsValidos.length > 0) {
          const roomPayload = await Promise.all(
            roomsValidos.map(async (room) => {
              let roomImageUrl = room.existingImageUrl || null;
              if (room.imagenFile) {
                roomImageUrl = await uploadFile(room.imagenFile, `productos/${editingProductId}/rooms`);
              }
              return {
                producto_id: editingProductId,
                titulo: room.titulo.trim(),
                descripcion: room.descripcion || "",
                precio: parseNumber(room.precio),
                imagen_url: roomImageUrl,
              };
            })
          );
          const { error: roomsError } = await supabase.from("rooms").insert(roomPayload);
          if (roomsError) throw roomsError;
        }

        // Reemplazar amenities
        await supabase.from("amenities").delete().eq("producto_id", editingProductId);
        const amenitiesValidos = amenities.filter((a) => a.nombre && a.nombre.trim());
        if (amenitiesValidos.length > 0) {
          const amenityRows = amenitiesValidos.map((a) => ({
            producto_id: editingProductId,
            nombre: a.nombre.trim(),
            icono_emoji: a.icono_emoji || null,
          }));
          const { error: amenityError } = await supabase.from("amenities").insert(amenityRows);
          if (amenityError) throw amenityError;
        }

        // Reemplazar highlights
        await supabase.from("highlights").delete().eq("producto_id", editingProductId);
        const highlightsValidos = highlights.filter((h) => h.descripcion && h.descripcion.trim());
        if (highlightsValidos.length > 0) {
          const highlightRows = highlightsValidos.map((h, index) => ({
            producto_id: editingProductId,
            descripcion: h.descripcion.trim(),
            posicion_orden: index + 1,
          }));
          const { error: highlightError } = await supabase.from("highlights").insert(highlightRows);
          if (highlightError) throw highlightError;
        }

        // Agregar nuevas imagenes a galeria (sin borrar las existentes)
        if (galleryFiles.length > 0) {
          const uploadedGallery = [];
          for (const file of galleryFiles) {
            const url = await uploadFile(file, `productos/${editingProductId}/gallery`);
            uploadedGallery.push(url);
          }
          const { data: maxPos } = await supabase
            .from("galleries")
            .select("posicion_orden")
            .eq("producto_id", editingProductId)
            .order("posicion_orden", { ascending: false })
            .limit(1)
            .maybeSingle();

          const offset = maxPos?.posicion_orden || 0;
          const galleryRows = uploadedGallery.map((url, index) => ({
            producto_id: editingProductId,
            imagen_url: url,
            posicion_orden: offset + index + 1,
          }));
          await supabase.from("galleries").insert(galleryRows);
        }

        setSuccess({ titulo: producto.titulo, categoria: categoriaNombre, ruta: rutaPorCategoria(categoriaNombre), modo: "editado" });
        resetForm();
        return;
      }

      // ── MODO CREAR ────────────────────────────────────────────────────────
      const imagenUrl = await uploadFile(producto.imagenFile, "productos");

      const { data: productoInsertado, error: productoError } = await supabase
        .from("productos")
        .insert({
          titulo: producto.titulo,
          descripcion: producto.descripcion,
          precio: parseNumber(producto.precio),
          imagen: imagenUrl,
          ubicacion: producto.ubicacion,
          rating: parseNumber(producto.rating),
          cantidad_reviews: parseNumber(producto.cantidad_reviews),
          fecha_inicio: producto.fecha_inicio || null,
          fecha_fin: producto.fecha_fin || null,
          color_fondo: producto.color_fondo,
          categoria_id: parseNumber(producto.categoria_id),
          activo: Boolean(producto.activo),
        })
        .select()
        .single();

      if (productoError) throw productoError;

      const productoId = productoInsertado.id;

      if (isCrucero) {
        const { error: detalleError } = await supabase.from("detalles_cruceros").insert({
          producto_id: productoId,
          anos_servicio: parseNumber(detalleCrucero.anos_servicio),
          pasajeros_max: parseNumber(detalleCrucero.pasajeros_max),
          tripulantes: parseNumber(detalleCrucero.tripulantes),
          ratio_espacio: parseNumber(detalleCrucero.ratio_espacio),
          ratio_servicio: parseNumber(detalleCrucero.ratio_servicio),
          cabina_single: detalleCrucero.cabina_single,
          viajando_con_ninos: detalleCrucero.viajando_con_ninos,
        });
        if (detalleError) throw detalleError;
      }

      if (galleryFiles.length > 0) {
        const uploadedGallery = [];
        for (const file of galleryFiles) {
          const url = await uploadFile(file, `productos/${productoId}/gallery`);
          uploadedGallery.push(url);
        }
        const galleryRows = uploadedGallery.map((url, index) => ({
          producto_id: productoId,
          imagen_url: url,
          posicion_orden: index + 1,
        }));
        const { error: galleryError } = await supabase.from("galleries").insert(galleryRows);
        if (galleryError) throw galleryError;
      }

      // Insertar rooms (solo aquellos con título)
      const roomsValidos = rooms.filter((room) => room.titulo.trim());
      if (roomsValidos.length > 0) {
        const roomPayload = await Promise.all(
          roomsValidos.map(async (room) => {
            let roomImageUrl = null;
            if (room.imagenFile) {
              roomImageUrl = await uploadFile(room.imagenFile, `productos/${productoId}/rooms`);
            }
            return {
              producto_id: productoId,
              titulo: room.titulo,
              descripcion: room.descripcion,
              precio: parseNumber(room.precio),
              imagen_url: roomImageUrl,
            };
          })
        );
        const { error: roomsError } = await supabase.from("rooms").insert(roomPayload);
        if (roomsError) throw roomsError;
      }

      // Insertar amenities (solo aquellos con nombre)
      const amenitiesValidos = amenities.filter((a) => a.nombre && a.nombre.trim());
      if (amenitiesValidos.length > 0) {
        const amenityRows = amenitiesValidos.map((a) => ({
          producto_id: productoId,
          nombre: a.nombre.trim(),
          icono_emoji: a.icono_emoji || null,
        }));
        const { error: amenityError } = await supabase.from("amenities").insert(amenityRows);
        if (amenityError) throw amenityError;
      }

      // Insertar highlights (solo aquellos con descripción)
      const highlightsValidos = highlights.filter((h) => h.descripcion && h.descripcion.trim());
      if (highlightsValidos.length > 0) {
        const highlightRows = highlightsValidos.map((h, index) => ({
          producto_id: productoId,
          descripcion: h.descripcion.trim(),
          posicion_orden: index + 1,
        }));
        const { error: highlightError } = await supabase.from("highlights").insert(highlightRows);
        if (highlightError) throw highlightError;
      }

      setSuccess({
        titulo: producto.titulo,
        categoria: categoriaNombre,
        ruta: rutaPorCategoria(categoriaNombre),
        modo: "creado",
      });
      resetForm();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      const errorMsg = err?.message || "Error desconocido";
      
      // Proporcionar mensajes más específicos para errores comunes
      if (errorMsg.includes("numeric field overflow")) {
        setFieldErrors({
          precio: true,
          rating: true,
          cantidad_reviews: true,
        });
        setError("🔴 ERROR DE OVERFLOW: Verifica que Precio, Rating y Reviews estén dentro de los límites.");
      } else if (errorMsg.includes("foreign key")) {
        setFieldErrors({ categoria_id: true });
        setError("🔴 ERROR: La categoría seleccionada no existe. Selecciona una categoría válida.");
      } else {
        setError(`🔴 Error al guardar: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Nombre de categoria por id (para lista) ──────────────────────────────
  const nombreCategoria = (catId) =>
    categorias.find((c) => String(c.id) === String(catId))?.nombre || "—";

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administracion</h1>
        <p>Crear, editar y gestionar productos del catalogo.</p>
      </div>

      {/* ── Tabs ── */}
      <div className="admin-tabs">
        <button
          className={`admin-tab${activeTab === "crear" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("crear"); setError(""); setSuccess(null); setFieldErrors({}); }}
        >
          {editingProductId ? "Editar producto" : "Crear producto"}
        </button>
        <button
          className={`admin-tab${activeTab === "gestionar" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("gestionar"); setError(""); setSuccess(null); setFieldErrors({}); }}
        >
          Gestionar productos
        </button>
        <button
          className={`admin-tab${activeTab === "contactos" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("contactos"); setError(""); setSuccess(null); setFieldErrors({}); }}
        >
          Mensajes
          {contactosList.filter(c => c.estado === "nuevo").length > 0 && (
            <span className="admin-tab-badge">
              {contactosList.filter(c => c.estado === "nuevo").length}
            </span>
          )}
        </button>
        <button
          className={`admin-tab${activeTab === "reservas" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("reservas"); setError(""); setSuccess(null); setFieldErrors({}); }}
        >
          Reservas
          {reservasList.filter(r => r.estado === "pendiente").length > 0 && (
            <span className="admin-tab-badge">
              {reservasList.filter(r => r.estado === "pendiente").length}
            </span>
          )}
        </button>
        <button
          className={`admin-tab${activeTab === "suscripciones" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("suscripciones"); setError(""); setSuccess(null); setFieldErrors({}); }}
        >
          Suscripciones
          {suscripcionesList.filter(s => s.estado === "pendiente_activacion").length > 0 && (
            <span className="admin-tab-badge">
              {suscripcionesList.filter(s => s.estado === "pendiente_activacion").length}
            </span>
          )}
        </button>
      </div>

      {/* ════════════════════════════════════════════════
          TAB: CREAR / EDITAR
      ════════════════════════════════════════════════ */}
      {activeTab === "crear" && (
        <form className="admin-form" onSubmit={handleSubmit}>

          {editingProductId && (
            <div className="admin-edit-banner">
              Editando producto ID <strong>{editingProductId}</strong>
              <button type="button" className="admin-edit-cancel" onClick={resetForm}>
                Cancelar edicion
              </button>
            </div>
          )}

          {/* ── Datos principales del producto ── */}
          <section className="admin-section">
            <h2>Producto</h2>

            <label className={fieldErrors.titulo ? "admin-field-error-label" : ""}>
              Titulo
              <input
                type="text"
                className={fieldErrors.titulo ? "admin-field-error" : ""}
                value={producto.titulo}
                onChange={(e) => handleProductoChange("titulo", e.target.value)}
                required
              />
              {fieldErrors.titulo && <span className="admin-field-error-msg">El título es obligatorio</span>}
            </label>

            <label>
              Descripcion
              <textarea
                rows={4}
                value={producto.descripcion}
                onChange={(e) => handleProductoChange("descripcion", e.target.value)}
              />
            </label>

            <div className="admin-grid">
              <label className={fieldErrors.precio ? "admin-field-error-label" : ""}>
                Precio (0 - 999,999)
                <input
                  type="number"
                  className={fieldErrors.precio ? "admin-field-error" : ""}
                  step="0.01"
                  min="0"
                  max="999999"
                  value={producto.precio}
                  onChange={(e) => handleProductoChange("precio", e.target.value)}
                  onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                  required
                />
                {fieldErrors.precio && <span className="admin-field-error-msg">⚠️ Precio máximo: 999,999</span>}
              </label>

              <label className={fieldErrors.categoria_id ? "admin-field-error-label" : ""}>
                Categoria
                <select
                  className={fieldErrors.categoria_id ? "admin-field-error" : ""}
                  value={producto.categoria_id}
                  onChange={(e) => handleProductoChange("categoria_id", e.target.value)}
                  required
                >
                  <option value="">Selecciona</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                {fieldErrors.categoria_id && <span className="admin-field-error-msg">Selecciona una categoría</span>}
              </label>

              <label>
                Ubicacion
                <input
                  type="text"
                  value={producto.ubicacion}
                  onChange={(e) => handleProductoChange("ubicacion", e.target.value)}
                />
              </label>

              <label>
                Color fondo
                <select
                  value={producto.color_fondo}
                  onChange={(e) => handleProductoChange("color_fondo", e.target.value)}
                >
                  <option value="verde">Verde</option>
                  <option value="verdeOscuro">Verde oscuro</option>
                  <option value="grisClaro">Gris claro</option>
                  <option value="naranja">Naranja</option>
                </select>
              </label>

              <label className={fieldErrors.rating ? "admin-field-error-label" : ""}>
                Rating (0 - 10)
                <input
                  type="number"
                  className={fieldErrors.rating ? "admin-field-error" : ""}
                  step="0.1"
                  min="0"
                  max="10"
                  value={producto.rating}
                  onChange={(e) => handleProductoChange("rating", e.target.value)}
                />
                {fieldErrors.rating && <span className="admin-field-error-msg">⚠️ Rating debe ser 0-10</span>}
              </label>

              <label className={fieldErrors.cantidad_reviews ? "admin-field-error-label" : ""}>
                Reviews (0 - 999,999)
                <input
                  type="number"
                  className={fieldErrors.cantidad_reviews ? "admin-field-error" : ""}
                  min="0"
                  max="999999"
                  value={producto.cantidad_reviews}
                  onChange={(e) => handleProductoChange("cantidad_reviews", e.target.value)}
                />
                {fieldErrors.cantidad_reviews && <span className="admin-field-error-msg">⚠️ Reviews máximo: 999,999</span>}
              </label>

              <label>
                Fecha inicio
                <input
                  type="date"
                  value={producto.fecha_inicio}
                  onChange={(e) => handleProductoChange("fecha_inicio", e.target.value)}
                />
              </label>

              <label>
                Fecha fin
                <input
                  type="date"
                  value={producto.fecha_fin}
                  onChange={(e) => handleProductoChange("fecha_fin", e.target.value)}
                />
              </label>
            </div>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={producto.activo}
                onChange={(e) => handleProductoChange("activo", e.target.checked)}
              />
              Activo
            </label>

            <label className={fieldErrors.imagenFile ? "admin-field-error-label" : ""}>
              Imagen principal {editingProductId ? "(dejar vacio para mantener la actual)" : "(subir archivo)"}
              {editingProductId && producto.imagen && (
                <div className="admin-current-image">
                  <img src={producto.imagen} alt="Imagen actual" />
                  <span>Imagen actual</span>
                </div>
              )}
              <input
                type="file"
                className={fieldErrors.imagenFile ? "admin-field-error" : ""}
                accept="image/*"
                onChange={(e) => handleProductoChange("imagenFile", e.target.files[0])}
                required={!editingProductId}
              />
              {fieldErrors.imagenFile && <span className="admin-field-error-msg">Debes subir una imagen</span>}
            </label>
          </section>

          {/* ── Detalles crucero ── */}
          {isCrucero && (
            <section className="admin-section">
              <h2>Detalles crucero</h2>
              <div className="admin-grid">
                <label>
                  Anos servicio
                  <input
                    type="number"
                    value={detalleCrucero.anos_servicio}
                    onChange={(e) => handleDetalleChange("anos_servicio", e.target.value)}
                  />
                </label>
                <label>
                  Pasajeros max
                  <input
                    type="number"
                    value={detalleCrucero.pasajeros_max}
                    onChange={(e) => handleDetalleChange("pasajeros_max", e.target.value)}
                  />
                </label>
                <label>
                  Tripulantes
                  <input
                    type="number"
                    value={detalleCrucero.tripulantes}
                    onChange={(e) => handleDetalleChange("tripulantes", e.target.value)}
                  />
                </label>
                <label>
                  Ratio espacio
                  <input
                    type="number"
                    step="0.1"
                    value={detalleCrucero.ratio_espacio}
                    onChange={(e) => handleDetalleChange("ratio_espacio", e.target.value)}
                  />
                </label>
                <label>
                  Ratio servicio
                  <input
                    type="number"
                    step="0.1"
                    value={detalleCrucero.ratio_servicio}
                    onChange={(e) => handleDetalleChange("ratio_servicio", e.target.value)}
                  />
                </label>
              </div>
              <div className="admin-checkboxes">
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={detalleCrucero.cabina_single}
                    onChange={(e) => handleDetalleChange("cabina_single", e.target.checked)}
                  />
                  Cabina single
                </label>
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={detalleCrucero.viajando_con_ninos}
                    onChange={(e) => handleDetalleChange("viajando_con_ninos", e.target.checked)}
                  />
                  Viajando con ninos
                </label>
              </div>
            </section>
          )}

          {/* ── Galeria ── */}
          <section className="admin-section">
            <h2>Galeria {editingProductId && "(agregar nuevas imagenes)"}</h2>
            <label>
              Seleccionar imagenes
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
              />
            </label>
            {galleryFiles.length > 0 && (
              <p className="admin-help">{galleryFiles.length} imagenes seleccionadas</p>
            )}
          </section>

          {/* ── Rooms ── */}
          <section className="admin-section">
            <h2>Rooms</h2>
            <p className="admin-help">Solo se guardan rooms con titulo. Descripcion y precio son opcionales.</p>
            {rooms.map((room, index) => (
              <div className="admin-list" key={`room-${index}`}>
                <label>
                  Titulo (requerido)
                  <input
                    type="text"
                    placeholder="Titulo (requerido)"
                    value={room.titulo}
                    onChange={(e) => updateListItem(setRooms, index, "titulo", e.target.value)}
                  />
                </label>
                <label>
                  Descripcion
                  <textarea
                    placeholder="Descripcion"
                    rows={2}
                    value={room.descripcion}
                    onChange={(e) => updateListItem(setRooms, index, "descripcion", e.target.value)}
                  />
                </label>
                <label>
                  Precio (opcional)
                  <input
                    type="number"
                    placeholder="Precio (opcional)"
                    min="0"
                    step="0.01"
                    value={room.precio}
                    onChange={(e) => updateListItem(setRooms, index, "precio", e.target.value)}
                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                  />
                </label>
                <label>
                  {room.existingImageUrl ? "Nueva imagen (reemplaza la actual)" : "Imagen"}
                  {room.existingImageUrl && (
                    <div className="admin-current-image admin-current-image--small">
                      <img src={room.existingImageUrl} alt="Imagen actual" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateListItem(setRooms, index, "imagenFile", e.target.files[0])}
                  />
                </label>
                {rooms.length > 1 && (
                  <button type="button" onClick={() => removeListItem(setRooms, index)}>
                    Quitar
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="admin-add" onClick={() => addListItem(setRooms, emptyRoom)}>
              + Agregar room
            </button>
          </section>

          {/* ── Amenities ── */}
          <section className="admin-section">
            <h2>Amenities</h2>

            {/* Chips de amenities seleccionados */}
            <div className="admin-amenity-chips">
              {amenities.length === 0 && (
                <p className="admin-help">Sin amenities. Agrega desde la lista o crea uno personalizado.</p>
              )}
              {amenities.map((amenity, index) => (
                <span key={`chip-${index}`} className="admin-amenity-chip">
                  {amenity.icono_emoji && (
                    <span className="admin-amenity-chip-emoji">{amenity.icono_emoji}</span>
                  )}
                  <span>{amenity.nombre}</span>
                  <button
                    type="button"
                    className="admin-amenity-chip-remove"
                    onClick={() => removeListItem(setAmenities, index)}
                    title="Quitar"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            {/* Selector de lista predefinida */}
            <div className="admin-amenity-selector">
              <button
                type="button"
                className="admin-add"
                onClick={() => {
                  setShowPredefinedDropdown((v) => !v);
                  setShowCustomEmojiPicker(false);
                }}
              >
                {showPredefinedDropdown ? "Cerrar lista ✕" : "+ Desde lista predefinida"}
              </button>
              {showPredefinedDropdown && (
                <div className="admin-amenity-dropdown">
                  {AMENITIES_PREDEFINIDOS.filter(
                    (p) => !amenities.some((a) => a.nombre === p.nombre)
                  ).length === 0 ? (
                    <p className="admin-help" style={{ padding: "12px" }}>
                      Todos los amenities predefinidos ya fueron agregados.
                    </p>
                  ) : (
                    AMENITIES_PREDEFINIDOS.filter(
                      (p) => !amenities.some((a) => a.nombre === p.nombre)
                    ).map((item) => (
                      <button
                        key={item.nombre}
                        type="button"
                        className="admin-amenity-option"
                        onClick={() =>
                          setAmenities((prev) => [
                            ...prev,
                            { nombre: item.nombre, icono_emoji: item.icono_emoji },
                          ])
                        }
                      >
                        <span>{item.icono_emoji}</span>
                        <span>{item.nombre}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Amenity personalizado */}
            <div className="admin-amenity-custom">
              <span className="admin-amenity-emoji-preview">
                {customAmenity.icono_emoji || "?"}
              </span>
              <button
                type="button"
                className="admin-emoji-toggle"
                onClick={() => {
                  setShowCustomEmojiPicker((v) => !v);
                  setShowPredefinedDropdown(false);
                }}
              >
                {showCustomEmojiPicker ? "Cerrar ✕" : "Emoji"}
              </button>
              <input
                className="admin-amenity-nombre"
                type="text"
                placeholder="Nombre personalizado (ej: Helipuerto)"
                value={customAmenity.nombre}
                onChange={(e) =>
                  setCustomAmenity((prev) => ({ ...prev, nombre: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (customAmenity.nombre.trim()) {
                      setAmenities((prev) => [
                        ...prev,
                        { nombre: customAmenity.nombre.trim(), icono_emoji: customAmenity.icono_emoji },
                      ]);
                      setCustomAmenity({ nombre: "", icono_emoji: "" });
                      setShowCustomEmojiPicker(false);
                    }
                  }
                }}
              />
              <button
                type="button"
                className="admin-add"
                onClick={() => {
                  if (customAmenity.nombre.trim()) {
                    setAmenities((prev) => [
                      ...prev,
                      { nombre: customAmenity.nombre.trim(), icono_emoji: customAmenity.icono_emoji },
                    ]);
                    setCustomAmenity({ nombre: "", icono_emoji: "" });
                    setShowCustomEmojiPicker(false);
                  }
                }}
              >
                + Agregar
              </button>
            </div>
            {showCustomEmojiPicker && (
              <div className="admin-emoji-grid">
                {EMOJIS_TRAVEL.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`admin-emoji-btn${customAmenity.icono_emoji === emoji ? " admin-emoji-btn--active" : ""}`}
                    onClick={() => {
                      setCustomAmenity((prev) => ({ ...prev, icono_emoji: emoji }));
                      setShowCustomEmojiPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ── Highlights ── */}
          <section className="admin-section">
            <h2>Highlights</h2>
            {highlights.map((highlight, index) => (
              <div className="admin-list" key={`highlight-${index}`}>
                <label>
                  Descripcion
                  <input
                    type="text"
                    placeholder="Descripcion"
                    value={highlight.descripcion}
                    onChange={(e) => updateListItem(setHighlights, index, "descripcion", e.target.value)}
                  />
                </label>
                {highlights.length > 1 && (
                  <button type="button" onClick={() => removeListItem(setHighlights, index)}>
                    Quitar
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="admin-add" onClick={() => addListItem(setHighlights, emptyHighlight)}>
              + Agregar highlight
            </button>
          </section>

          {/* ── Mensajes ── */}
          {error && <div className="admin-error">{error}</div>}
          {success && (
            <div className="admin-success">
              <strong>Producto {success.modo} correctamente</strong>
              <ul className="admin-success-detail">
                <li><span>Nombre:</span> {success.titulo}</li>
                <li><span>Categoria:</span> {success.categoria}</li>
                <li><span>Ruta:</span> <code>{success.ruta}</code></li>
              </ul>
            </div>
          )}

          <button className="admin-submit" type="submit" disabled={loading}>
            {loading ? "Guardando..." : editingProductId ? "Guardar cambios" : "Crear producto"}
          </button>
        </form>
      )}

      {/* ════════════════════════════════════════════════
          TAB: GESTIONAR PRODUCTOS
      ════════════════════════════════════════════════ */}
      {activeTab === "gestionar" && (
        <div className="admin-gestionar">
          <div className="admin-gestionar-header">
            <p>{productosLista.length} productos en total</p>
            <button className="admin-add" onClick={loadProductosAdmin} disabled={loadingLista}>
              {loadingLista ? "Cargando..." : "Actualizar lista"}
            </button>
          </div>

          {error && <div className="admin-error">{error}</div>}

          {loadingLista ? (
            <p className="admin-help">Cargando productos...</p>
          ) : productosLista.length === 0 ? (
            <p className="admin-help">No hay productos aun.</p>
          ) : (
            <div className="admin-product-list">
              {productosLista.map((p) => (
                <div className="admin-product-card" key={p.id}>
                  {p.imagen && (
                    <div className="admin-product-thumb">
                      <img src={p.imagen} alt={p.titulo} />
                    </div>
                  )}
                  <div className="admin-product-info">
                    <span className="admin-product-title">{p.titulo}</span>
                    <span className="admin-product-meta">
                      {nombreCategoria(p.categoria_id)} · ${Number(p.precio).toLocaleString()}
                    </span>
                    <span className={`admin-product-status${p.activo ? " admin-product-status--active" : " admin-product-status--inactive"}`}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="admin-product-actions">
                    <button
                      className="admin-btn-edit"
                      onClick={() => handleEdit(p.id)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    {confirmDeleteId === p.id ? (
                      <div className="admin-delete-confirm">
                        <span>¿Eliminar?</span>
                        <button
                          className="admin-btn-delete-confirm"
                          onClick={() => handleDelete(p.id)}
                          disabled={loading}
                        >
                          Si, eliminar
                        </button>
                        <button
                          className="admin-btn-delete-cancel"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        className="admin-btn-delete"
                        onClick={() => setConfirmDeleteId(p.id)}
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════
          TAB: MENSAJES / CONTACTOS
      ════════════════════════════════════════════════ */}
      {activeTab === "contactos" && (
        <div className="admin-gestionar">
          <div className="admin-gestionar-header">
            <p>{contactosList.length} mensajes en total</p>
            <button className="admin-add" onClick={loadContactos} disabled={loadingContactos}>
              {loadingContactos ? "Cargando..." : "Actualizar"}
            </button>
          </div>
          {loadingContactos ? (
            <p className="admin-help">Cargando mensajes...</p>
          ) : contactosList.length === 0 ? (
            <p className="admin-help">No hay mensajes aún.</p>
          ) : (
            <div className="admin-inbox">
              {contactosList.map((c) => (
                <div
                  key={c.id}
                  className={`admin-inbox-item${c.estado === "nuevo" ? " admin-inbox-item--nuevo" : ""}${contactoExpandido === c.id ? " admin-inbox-item--open" : ""}`}
                >
                  <div
                    className="admin-inbox-item__head"
                    onClick={() => setContactoExpandido(contactoExpandido === c.id ? null : c.id)}
                  >
                    <div className="admin-inbox-item__meta">
                      <span className="admin-inbox-item__nombre">{c.nombre}</span>
                      <span className="admin-inbox-item__email">{c.email}</span>
                      {c.telefono && <span className="admin-inbox-item__tel">{c.telefono}</span>}
                    </div>
                    <div className="admin-inbox-item__right">
                      <span className="admin-inbox-item__asunto">{c.asunto}</span>
                      <span className="admin-inbox-item__fecha">
                        {new Date(c.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <span className={`admin-inbox-item__estado admin-inbox-item__estado--${c.estado}`}>
                        {c.estado === "nuevo" ? "Nuevo" : c.estado === "leido" ? "Leído" : "Respondido"}
                      </span>
                    </div>
                  </div>
                  {contactoExpandido === c.id && (
                    <div className="admin-inbox-item__body">
                      <p className="admin-inbox-item__mensaje">{c.mensaje}</p>
                      <div className="admin-inbox-item__actions">
                        <span>Marcar como:</span>
                        {["nuevo", "leido", "respondido"].map((est) => (
                          <button
                            key={est}
                            className={`admin-inbox-btn${c.estado === est ? " admin-inbox-btn--active" : ""}`}
                            onClick={() => handleContactoEstado(c.id, est)}
                            disabled={c.estado === est}
                          >
                            {est === "nuevo" ? "Nuevo" : est === "leido" ? "Leído" : "Respondido"}
                          </button>
                        ))}
                        <a
                          href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.asunto)}`}
                          className="admin-inbox-btn admin-inbox-btn--reply"
                        >
                          Responder por email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════
          TAB: RESERVAS
      ════════════════════════════════════════════════ */}
      {activeTab === "reservas" && (
        <div className="admin-gestionar">
          <div className="admin-gestionar-header">
            <p>{reservasList.length} solicitudes en total</p>
            <button className="admin-add" onClick={loadReservas} disabled={loadingReservas}>
              {loadingReservas ? "Cargando..." : "Actualizar"}
            </button>
          </div>
          {loadingReservas ? (
            <p className="admin-help">Cargando reservas...</p>
          ) : reservasList.length === 0 ? (
            <p className="admin-help">No hay solicitudes de reserva aún.</p>
          ) : (
            <div className="admin-reservas-list">
              {reservasList.map((r) => (
                <div key={r.id} className={`admin-reserva-card admin-reserva-card--${r.estado}`}>
                  <div className="admin-reserva-card__top">
                    <div className="admin-reserva-card__info">
                      <span className="admin-reserva-card__paquete">{r.paquete_nombre}</span>
                      <span className="admin-reserva-card__cliente">
                        {r.nombre} · {r.email}
                        {r.telefono && ` · ${r.telefono}`}
                      </span>
                      <span className="admin-reserva-card__detalle">
                        {r.fecha_viaje
                          ? new Date(r.fecha_viaje).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })
                          : "Fecha por confirmar"}
                        {" · "}
                        {r.pasajeros} {r.pasajeros === 1 ? "pasajero" : "pasajeros"}
                      </span>
                      {r.comentarios && (
                        <span className="admin-reserva-card__comentario">"{r.comentarios}"</span>
                      )}
                      <span className="admin-reserva-card__fecha-solicitud">
                        Solicitado: {new Date(r.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <span className={`admin-reserva-card__estado admin-reserva-card__estado--${r.estado}`}>
                      {r.estado === "pendiente" ? "Pendiente" : r.estado === "confirmada" ? "Confirmada" : r.estado === "cancelada" ? "Cancelada" : "Completada"}
                    </span>
                  </div>
                  <div className="admin-reserva-card__actions">
                    <span>Estado:</span>
                    {["pendiente", "confirmada", "cancelada", "completada"].map((est) => (
                      <button
                        key={est}
                        className={`admin-inbox-btn${r.estado === est ? " admin-inbox-btn--active" : ""}`}
                        onClick={() => handleReservaEstado(r.id, est)}
                        disabled={r.estado === est}
                      >
                        {est === "pendiente" ? "Pendiente" : est === "confirmada" ? "Confirmar" : est === "cancelada" ? "Cancelar" : "Completar"}
                      </button>
                    ))}
                    <a
                      href={`mailto:${r.email}?subject=Tu reserva: ${encodeURIComponent(r.paquete_nombre)}`}
                      className="admin-inbox-btn admin-inbox-btn--reply"
                    >
                      Contactar cliente
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* ════════════════════════════════════════════════
          TAB: SUSCRIPCIONES
      ════════════════════════════════════════════════ */}
      {activeTab === "suscripciones" && (
        <div className="admin-gestionar">
          <div className="admin-gestionar-header">
            <p>{suscripcionesList.length} suscripciones en total</p>
            <button className="admin-add" onClick={loadSuscripciones} disabled={loadingSuscripciones}>
              {loadingSuscripciones ? "Cargando..." : "Actualizar"}
            </button>
          </div>
          {loadingSuscripciones ? (
            <p className="admin-help">Cargando suscripciones...</p>
          ) : suscripcionesList.length === 0 ? (
            <p className="admin-help">No hay suscripciones registradas aún.</p>
          ) : (
            <div className="admin-subs-list">
              {suscripcionesList.map((s) => (
                <div key={s.id} className={`admin-subs-card admin-subs-card--${s.estado}`}>
                  <div className="admin-subs-card__top">
                    <div className="admin-subs-card__info">
                      <span className="admin-subs-card__plan">
                        Plan {s.plan.charAt(0).toUpperCase() + s.plan.slice(1)}
                      </span>
                      <span className="admin-subs-card__email">
                        {s.email || s.user_id}
                      </span>
                      <span className="admin-subs-card__fecha">
                        Solicitado:{" "}
                        {new Date(s.created_at).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {s.payment_provider && (
                        <span className="admin-subs-card__payment">
                          Pago: {s.payment_provider}
                          {s.payment_id && ` · ${s.payment_id}`}
                        </span>
                      )}
                    </div>
                    <span className={`admin-subs-card__estado admin-subs-card__estado--${s.estado}`}>
                      {s.estado === "pendiente_activacion"
                        ? "Pendiente"
                        : s.estado === "activa"
                        ? "Activa"
                        : "Cancelada"}
                    </span>
                  </div>
                  <div className="admin-reserva-card__actions">
                    <span>Estado:</span>
                    {["pendiente_activacion", "activa", "cancelada"].map((est) => (
                      <button
                        key={est}
                        className={`admin-inbox-btn${s.estado === est ? " admin-inbox-btn--active" : ""}`}
                        onClick={() => handleSuscripcionEstado(s.id, est)}
                        disabled={s.estado === est}
                      >
                        {est === "pendiente_activacion"
                          ? "Pendiente"
                          : est === "activa"
                          ? "Activar"
                          : "Cancelar"}
                      </button>
                    ))}
                    {s.email && (
                      <a
                        href={`mailto:${s.email}?subject=Tu suscripción plan ${s.plan} - Cruceros y Tours`}
                        className="admin-inbox-btn admin-inbox-btn--reply"
                      >
                        Contactar cliente
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
