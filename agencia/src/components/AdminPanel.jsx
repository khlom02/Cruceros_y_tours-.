import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/admin.css";
import SEO from './SEO.jsx';
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
  fetchAlojamientosByProducto,
  insertAlojamiento,
  updateAlojamiento,
  deleteAlojamiento,
  fetchAlojamientoImagenes,
  insertAlojamientoImagen,
  deleteAlojamientoImagen,
} from "../backend/supabase_client";
import AlojamientoCard from "./AlojamientoCard";

// ─── Nombre del bucket de Supabase Storage donde se guardan las imagenes ───
const BUCKET_NAME = "content media";

// ─── Tipos permitidos y tamaño máximo para archivos ────────────────────────
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANO_MAX_MB = 5;

// ─── Validar y convertir números de manera segura ─────────────────────────
const parseNumber = (value) => {
  if (!value || value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return null;
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

const emptyAlojamiento = {
  id: null,
  titulo: "",
  precio: "",
  imagen_url: "",
  imagenFile: null,
  previewUrl: "",
  estrellas: 3,
  distancia_centro: "",
  categoria: "",
  tipo_habitacion: "",
  enlace_externo: "",
  descripcion: "",
  direccion: "",
  latitud: "",
  longitud: "",
  texto_venta: "",
  servicios_incluidos: [],
  tarifa_incluye: [],
  tipos_habitacion: [],
  galerias: {
    hotel: [],
    habitacion: [],
    comida: [],
    servicio: [],
  },
  galeriasToDelete: [],
};

const emptyEditFields = {
  titulo: "",
  descripcion: "",
  precio: "",
  ubicacion: "",
  activo: true,
  imagen: "",
  imagenFile: null,
};

const AdminPanel = () => {

  // ─── Tabs ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("crear");

  // ─── Estado general del formulario ────────────────────────────────────────
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  // ─── Modo edicion ─────────────────────────────────────────────────────────
  const [editingProductId, setEditingProductId] = useState(null);

  // ─── Categoria seleccionada ──────────────────────────────────────────────
  const [categoria_id, setCategoria_id] = useState("");

  // ─── Lista de productos (tab Gestionar) ───────────────────────────────────
  const [productosLista, setProductosLista] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);

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

  // ─── Alojamientos para edición de destinos ────────────────────────────────
  const [alojamientos, setAlojamientos] = useState([]);
  const [alojamientosToDelete, setAlojamientosToDelete] = useState([]);

  // ─── Campos editables del producto en modo edicion ──────────────────────
  const [editFields, setEditFields] = useState({ ...emptyEditFields });
  const handleEditFieldChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Guard contra doble submit ────────────────────────────────────────────
  const submittingRef = useRef(false);

  // ─── Colapsar secciones del formulario ────────────────────────────────────
  const [expandedSections, setExpandedSections] = useState({
    alojamientos: true,
  });

  // ─── Formulario especial para Destinos Nacionales / Internacionales ────
  const emptyDestino = { destino: '', pais: '', precio: '', imagenes: [], previewUrls: [] };
  const [destinosItems, setDestinosItems] = useState([{ ...emptyDestino }]);
  const [destinoImageIndex, setDestinoImageIndex] = useState({});
  const isDestinosCategory = useMemo(() => {
    const nombre = categorias.find((c) => String(c.id) === String(categoria_id))?.nombre || '';
    return nombre.toLowerCase().includes('destinos nacionales') || nombre.toLowerCase().includes('destinos internacionales');
  }, [categorias, categoria_id]);
  const toggleSection = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ─── Busqueda y filtro por categoria en lista de productos ────────────────
  const [productSearch, setProductSearch] = useState("");
  const [gestionarCategoriaId, setGestionarCategoriaId] = useState("");

  // ─── Modal de confirmacion ────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(null);

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
    return categorias.find((cat) => String(cat.id) === String(categoria_id))?.nombre || "";
  }, [categorias, categoria_id]);

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
    setCategoria_id("");
    setEditingProductId(null);
    setEditFields({ ...emptyEditFields });
    
    setError("");
    submittingRef.current = false;
    resetDestinosForm();
    setAlojamientos([]);
    setAlojamientosToDelete([]);
  };

  // ─── Cargar producto en el formulario para edicion ────────────────────────
  const handleEdit = async (productId) => {
    setError("");
    setSuccess(null);
    
    setLoading(true);

    try {
      const data = await fetchProductAdminById(productId);
      if (!data) throw new Error("Producto no encontrado");

      setCategoria_id(String(data.categoria_id || ""));
      setEditingProductId(productId);
      setActiveTab("crear");
      setEditFields({
        titulo: data.titulo || "",
        descripcion: data.descripcion || "",
        precio: String(data.precio ?? ""),
        ubicacion: data.ubicacion || "",
        activo: data.activo !== false,
        imagen: data.imagen || "",
        imagenFile: null,
      });

      // Cargar alojamientos si es un destino
      const cat = categorias.find((c) => String(c.id) === String(data.categoria_id));
      const isDestino = cat && (cat.nombre.toLowerCase().includes("destinos nacionales") || cat.nombre.toLowerCase().includes("destinos internacionales"));
      if (isDestino) {
        const aloj = await fetchAlojamientosByProducto(productId);
        const alojConImagenes = await Promise.all(
          (aloj || []).map(async (a) => {
            const imagenes = await fetchAlojamientoImagenes(a.id);
            const galerias = { hotel: [], habitacion: [], comida: [], servicio: [] };
            imagenes.forEach((img) => {
              if (galerias[img.tipo]) {
                galerias[img.tipo].push({ ...img, file: null, previewUrl: "" });
              }
            });
            return {
              ...a,
              imagenFile: null,
              previewUrl: "",
              servicios_incluidos: Array.isArray(a.servicios_incluidos) ? a.servicios_incluidos : [],
              tarifa_incluye: Array.isArray(a.tarifa_incluye) ? a.tarifa_incluye : [],
              tipos_habitacion: Array.isArray(a.tipos_habitacion) ? a.tipos_habitacion : [],
              galerias,
              galeriasToDelete: [],
            };
          })
        );
        setAlojamientos(alojConImagenes);
      }
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
    } else {
      setError("Error al eliminar el producto.");
    }
  };

  // ─── Envio del formulario: crear o actualizar ──────────────────────────────
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(null);

    // ── MODO CREACION ──────────────────────────────────────────────────────
    if (!editingProductId) {
      if (isDestinosCategory) {
        const validItems = destinosItems.filter((d) => d.destino.trim() && d.pais.trim() && d.precio);
        if (validItems.length === 0) {
          setError("Debes agregar al menos un destino con destino, país y precio.");
          return;
        }
        for (const item of validItems) {
          if (item.imagenes.length === 0) {
            setError(`El destino "${item.destino}" debe tener al menos una imagen.`);
            return;
          }
        }

        try {
          setLoading(true);
          const catId = parseNumber(categoria_id);

          for (const item of validItems) {
            const imageUrls = [];
            for (const file of item.imagenes) {
              const url = await uploadFile(file, 'productos/destinos');
              imageUrls.push(url);
            }

            const { data: prod, error: prodErr } = await supabase
              .from('productos')
              .insert({
                titulo: item.destino.trim(),
                descripcion: `${item.destino.trim()}, ${item.pais.trim()}`,
                precio: parseNumber(item.precio),
                imagen: imageUrls[0] || null,
                ubicacion: `${item.destino.trim()}, ${item.pais.trim()}`,
                categoria_id: catId,
                activo: true,
                color_fondo: 'verde',
              })
              .select()
              .single();

            if (prodErr) throw prodErr;

            if (imageUrls.length > 1) {
              const galleryRows = imageUrls.slice(1).map((url, idx) => ({
                producto_id: prod.id,
                imagen_url: url,
                posicion_orden: idx + 1,
              }));
              const { error: gErr } = await supabase.from('galleries').insert(galleryRows);
              if (gErr) throw gErr;
            }
          }

          setSuccess({
            titulo: `${validItems.length} destino(s)`,
            categoria: categoriaNombre,
            ruta: rutaPorCategoria(categoriaNombre),
            modo: 'creado',
          });
          resetForm();
        } catch (err) {
          console.error('Error al guardar destinos:', err);
          setError(`Error al guardar: ${err?.message || 'Error desconocido'}`);
        } finally {
          setLoading(false);
        }
      } else {
        setError("Gestor próximo para esta categoría.");
      }
      return;
    }

    // ── MODO EDICION (cualquier categoria) ────────────────────────────────
    try {
      setLoading(true);

      const imagenUrl = editFields.imagenFile
        ? await uploadFile(editFields.imagenFile, "productos")
        : editFields.imagen;

      const { error: updateError } = await supabase
        .from("productos")
        .update({
          titulo: editFields.titulo,
          descripcion: editFields.descripcion,
          precio: parseNumber(editFields.precio),
          imagen: imagenUrl,
          ubicacion: editFields.ubicacion,
          activo: Boolean(editFields.activo),
        })
        .eq("id", editingProductId);

      if (updateError) throw updateError;

      // Alojamientos (solo destinos)
      if (isDestinosCategory) {
        for (const id of alojamientosToDelete) {
          await deleteAlojamiento(id);
        }

        for (let i = 0; i < alojamientos.length; i++) {
          const a = alojamientos[i];
          let imgUrl = a.imagen_url;
          if (a.imagenFile) {
            imgUrl = await uploadFile(a.imagenFile, "productos/alojamientos");
          }
          const payload = {
            producto_id: editingProductId,
            titulo: a.titulo,
            precio: parseNumber(a.precio),
            imagen_url: imgUrl || null,
            estrellas: a.estrellas,
            distancia_centro: a.distancia_centro || null,
            categoria: a.categoria || null,
            tipo_habitacion: a.tipo_habitacion || null,
            enlace_externo: a.enlace_externo || null,
            descripcion: a.descripcion || null,
            direccion: a.direccion || null,
            latitud: a.latitud ? parseNumber(a.latitud) : null,
            longitud: a.longitud ? parseNumber(a.longitud) : null,
            texto_venta: a.texto_venta || null,
            servicios_incluidos: Array.isArray(a.servicios_incluidos)
              ? a.servicios_incluidos.filter((s) => typeof s === "string" && s.trim())
              : [],
            tarifa_incluye: Array.isArray(a.tarifa_incluye)
              ? a.tarifa_incluye.filter((s) => typeof s === "string" && s.trim())
              : [],
            tipos_habitacion: Array.isArray(a.tipos_habitacion)
              ? a.tipos_habitacion.filter((s) => typeof s === "string" && s.trim())
              : [],
            posicion_orden: i,
          };

          let alojamientoId = a.id;
          if (a.id) {
            await updateAlojamiento(a.id, payload);
          } else {
            const nuevo = await insertAlojamiento(payload);
            if (nuevo?.id) alojamientoId = nuevo.id;
          }

          if (!alojamientoId) continue;

          // Eliminar imágenes marcadas para borrar
          for (const id of (a.galeriasToDelete || [])) {
            await deleteAlojamientoImagen(id);
          }

          // Subir nuevas imágenes de cada galería
          const tipos = ["hotel", "habitacion", "comida", "servicio"];
          for (const tipo of tipos) {
            const imagenes = a.galerias?.[tipo] || [];
            for (let j = 0; j < imagenes.length; j++) {
              const img = imagenes[j];
              if (img.file) {
                const url = await uploadFile(img.file, `productos/alojamientos/${tipo}`);
                await insertAlojamientoImagen({
                  alojamiento_id: alojamientoId,
                  tipo,
                  imagen_url: url,
                  titulo: img.titulo || `${tipo} ${j + 1}`,
                  posicion_orden: j,
                });
              }
            }
          }
        }
      }

      setSuccess({
        titulo: editFields.titulo,
        categoria: categoriaNombre,
        ruta: rutaPorCategoria(categoriaNombre),
        modo: "editado",
      });
      resetForm();
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(`Error al guardar: ${err?.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── Nombre de categoria por id (para lista) ──────────────────────────────
  const nombreCategoria = (catId) =>
    categorias.find((c) => String(c.id) === String(catId))?.nombre || "—";

  // ─── Handlers para formulario de Destinos ──────────────────────────────
  const handleDestinoChange = (index, field, value) => {
    setDestinosItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleDestinoImageAdd = async (index, files, inputEl) => {
    const fileArray = Array.from(files || []).slice(0, 3);
    const toDataUrl = (f) =>
      typeof f === 'string'
        ? Promise.resolve(f)
        : new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(f);
          });

    setDestinosItems((prev) => {
      const item = prev[index];
      if (!item) return prev;
      const combined = [...item.imagenes, ...fileArray].slice(0, 3);
      Promise.all(combined.map(toDataUrl)).then((allUrls) => {
        setDestinosItems((p) =>
          p.map((it, i) => (i === index ? { ...it, previewUrls: allUrls } : it))
        );
      });
      return prev.map((it, i) => (i === index ? { ...it, imagenes: combined } : it));
    });

    if (inputEl) inputEl.value = '';
  };

  const handleDestinoImageRemove = (index, imgIndex) => {
    setDestinosItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newImgs = item.imagenes.filter((_, j) => j !== imgIndex);
        const newPreviews = item.previewUrls.filter((_, j) => j !== imgIndex);
        return { ...item, imagenes: newImgs, previewUrls: newPreviews };
      })
    );
    setDestinoImageIndex((prev) => ({ ...prev, [index]: 0 }));
  };

  const addDestinoItem = () => {
    setDestinosItems((prev) => [...prev, { ...emptyDestino }]);
  };

  const removeDestinoItem = (index) => {
    if (destinosItems.length <= 1) return;
    setDestinosItems((prev) => prev.filter((_, i) => i !== index));
  };

  const navigateDestinoImage = (itemIndex, dir) => {
    setDestinoImageIndex((prev) => {
      const current = prev[itemIndex] || 0;
      const total = destinosItems[itemIndex]?.previewUrls?.length || 0;
      if (total === 0) return prev;
      const next = dir === 'next'
        ? (current + 1) % total
        : (current - 1 + total) % total;
      return { ...prev, [itemIndex]: next };
    });
  };

  const resetDestinosForm = () => {
    setDestinosItems([{ ...emptyDestino }]);
    setDestinoImageIndex({});
  };

  // ─── Handlers para alojamientos destinos ──────────────────────────────────
  const handleAlojamientoChange = (index, field, value) => {
    setAlojamientos((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAlojamientoImage = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAlojamientos((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, imagenFile: file, previewUrl: e.target.result } : item
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const addAlojamiento = () => {
    setAlojamientos((prev) => [...prev, { ...emptyAlojamiento }]);
  };

  const removeAlojamiento = (index) => {
    setAlojamientos((prev) => {
      const removed = prev[index];
      if (removed?.id) {
        setAlojamientosToDelete((d) => [...d, removed.id]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const moveAlojamiento = (index, direction) => {
    setAlojamientos((prev) => {
      const newArr = [...prev];
      const target = index + direction;
      if (target < 0 || target >= newArr.length) return prev;
      [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
      return newArr;
    });
  };

  const handleAlojamientoArrayChange = (index, field, arrayIndex, value) => {
    setAlojamientos((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const arr = [...(item[field] || [])];
        arr[arrayIndex] = value;
        return { ...item, [field]: arr };
      })
    );
  };

  const addAlojamientoArrayItem = (index, field) => {
    setAlojamientos((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: [...(item[field] || []), ""] } : item
      )
    );
  };

  const removeAlojamientoArrayItem = (index, field, arrayIndex) => {
    setAlojamientos((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: (item[field] || []).filter((_, j) => j !== arrayIndex),
            }
          : item
      )
    );
  };

  const handleAlojamientoGaleriaImage = (index, tipo, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAlojamientos((prev) =>
        prev.map((item, i) => {
          if (i !== index) return item;
          const galerias = { ...item.galerias };
          galerias[tipo] = [
            ...(galerias[tipo] || []),
            { file, previewUrl: e.target.result, titulo: "" },
          ];
          return { ...item, galerias };
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const removeAlojamientoGaleriaImage = (index, tipo, imgIndex, imgId) => {
    setAlojamientos((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const galerias = { ...item.galerias };
        galerias[tipo] = (galerias[tipo] || []).filter((_, j) => j !== imgIndex);
        const galeriasToDelete = imgId
          ? [...(item.galeriasToDelete || []), imgId]
          : item.galeriasToDelete || [];
        return { ...item, galerias, galeriasToDelete };
      })
    );
  };

  const productosFiltrados = useMemo(() => {
    let result = productosLista;

    if (gestionarCategoriaId) {
      result = result.filter((p) => String(p.categoria_id) === String(gestionarCategoriaId));
    }

    if (!productSearch.trim()) return result;

    const q = productSearch.toLowerCase();
    return result.filter((p) => {
      const catNombre = categorias.find((c) => String(c.id) === String(p.categoria_id))?.nombre || "";
      return p.titulo.toLowerCase().includes(q) || catNombre.toLowerCase().includes(q);
    });
  }, [productosLista, productSearch, categorias, gestionarCategoriaId]);

  const canSubmit = isDestinosCategory || !!editingProductId;
  const submitBtnText = loading
    ? "Guardando..."
    : isDestinosCategory && !editingProductId
      ? "Crear destino(s)"
      : editingProductId
        ? "Guardar cambios"
        : "Crear producto";

  return (
    <>
      <SEO
        title="Panel de Administracion"
        description="Panel de administracion para gestionar productos, categorias, reservas y contenido del sitio."
        noindex
      />
      <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administracion</h1>
        <p>Crear, editar y gestionar productos del catalogo.</p>
      </div>

      {/* ── Tabs ── */}
      <div className="admin-tabs">
        <button
          className={`admin-tab${activeTab === "crear" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("crear"); setError(""); setSuccess(null);  }}
        >
          <span className="admin-tab-icon">{editingProductId ? "✏️" : "✨"}</span>
          {editingProductId ? "Editar" : "Crear"}
        </button>
        <button
          className={`admin-tab${activeTab === "gestionar" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("gestionar"); setError(""); setSuccess(null);  }}
        >
          <span className="admin-tab-icon">📋</span>
          Gestionar
        </button>
        <button
          className={`admin-tab${activeTab === "contactos" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("contactos"); setError(""); setSuccess(null);  }}
        >
          <span className="admin-tab-icon">✉️</span>
          Mensajes
          {contactosList.filter(c => c.estado === "nuevo").length > 0 && (
            <span className="admin-tab-badge">
              {contactosList.filter(c => c.estado === "nuevo").length}
            </span>
          )}
        </button>
        <button
          className={`admin-tab${activeTab === "reservas" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("reservas"); setError(""); setSuccess(null);  }}
        >
          <span className="admin-tab-icon">📅</span>
          Reservas
          {reservasList.filter(r => r.estado === "pendiente").length > 0 && (
            <span className="admin-tab-badge">
              {reservasList.filter(r => r.estado === "pendiente").length}
            </span>
          )}
        </button>
        <button
          className={`admin-tab${activeTab === "suscripciones" ? " admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("suscripciones"); setError(""); setSuccess(null);  }}
        >
          <span className="admin-tab-icon">🔄</span>
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

          {/* ── Selector de categoría centrado (solo crear) ── */}
          {!editingProductId && (
            <section className="admin-categoria-selector">
              <h2>Categoria</h2>
              <select
                id="admin-categoria"
                value={categoria_id}
                onChange={(e) => setCategoria_id(e.target.value)}
                required
              >
                <option value="">Selecciona una categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </section>
          )}

          {editingProductId && (
            <div className="admin-categoria-info">
              ⚠️ Trabajando actualmente en la categoría: <strong>{categoriaNombre}</strong>
            </div>
          )}

          {/* ── Formulario de edicion del producto (cualquier categoria) ── */}
          {editingProductId && (
            <section className="admin-section">
              <h2>📦 Datos del producto</h2>
              <div className="admin-grid">
                <label style={{ gridColumn: '1 / -1' }}>
                  Titulo
                  <input type="text" value={editFields.titulo} onChange={(e) => handleEditFieldChange('titulo', e.target.value)} required />
                </label>
                <label style={{ gridColumn: '1 / -1' }}>
                  Descripcion
                  <textarea rows={3} value={editFields.descripcion} onChange={(e) => handleEditFieldChange('descripcion', e.target.value)} />
                </label>
                <label>
                  Precio
                  <input type="number" min="0" step="1" value={editFields.precio} onChange={(e) => handleEditFieldChange('precio', e.target.value)} onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()} />
                </label>
                <label>
                  Ubicacion
                  <input type="text" value={editFields.ubicacion} onChange={(e) => handleEditFieldChange('ubicacion', e.target.value)} />
                </label>
                <label className="admin-toggle" style={{ gridColumn: '1 / -1' }}>
                  <input type="checkbox" checked={editFields.activo} onChange={(e) => handleEditFieldChange('activo', e.target.checked)} />
                  <span className="admin-toggle-track"></span>
                  {editFields.activo ? 'Activo' : 'Inactivo'}
                </label>
                <label style={{ gridColumn: '1 / -1' }}>
                  Imagen {editFields.imagen ? '(dejar vacio para mantener la actual)' : ''}
                  {editFields.imagen && !editFields.imagenFile && (
                    <div className="admin-current-image">
                      <img src={editFields.imagen} alt="Imagen actual" />
                      <span>Imagen actual</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => setEditFields((prev) => ({ ...prev, imagenFile: e.target.files[0] }))} />
                </label>
              </div>
            </section>
          )}

          {/* ── Contenido dinámico según categoría ── */}
          {categoria_id && (
            <>

              {/* ── Formulario especial para Destinos Nacionales / Internacionales ── */}
              {isDestinosCategory && !editingProductId && (
                <div className="admin-destinos-form">
                  <p className="admin-help" style={{ marginBottom: '16px', fontSize: '0.95rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                    Formulario especial de destinos — Máximo 3 imágenes por producto, navegables con flechas
                  </p>

                  {destinosItems.map((item, idx) => (
                    <div key={`destino-${idx}`} className="admin-destino-card">
                      <div className="admin-destino-card__header">
                        <span className="admin-destino-card__number">{idx + 1}</span>
                        <span className="admin-destino-card__label">Destino {idx + 1}</span>
                        {destinosItems.length > 1 && (
                          <button type="button" className="admin-btn-delete" onClick={() => removeDestinoItem(idx)} style={{ marginLeft: 'auto', padding: '5px 12px', fontSize: '0.8rem' }}>
                            Quitar
                          </button>
                        )}
                      </div>

                      <div className="admin-destino-card__body">
                        {/* Preview de imágenes con flechas */}
                        <div className="admin-destino-preview">
                          {item.previewUrls.length > 0 ? (
                            <>
                              <div className="admin-destino-preview__image-wrapper">
                                <img
                                  key={item.previewUrls[destinoImageIndex[idx] || 0]}
                                  src={item.previewUrls[destinoImageIndex[idx] || 0]}
                                  alt={`Preview ${idx + 1}`}
                                  className="admin-destino-preview__image"
                                />
                                {item.previewUrls.length > 1 && (
                                  <>
                                    <button type="button" className="admin-destino-preview__arrow admin-destino-preview__arrow--left" onClick={() => navigateDestinoImage(idx, 'prev')}>‹</button>
                                    <button type="button" className="admin-destino-preview__arrow admin-destino-preview__arrow--right" onClick={() => navigateDestinoImage(idx, 'next')}>›</button>
                                    <div className="admin-destino-preview__counter">
                                      {(destinoImageIndex[idx] || 0) + 1} / {item.previewUrls.length}
                                    </div>
                                  </>
                                )}
                                <button type="button" className="admin-destino-preview__remove" onClick={() => handleDestinoImageRemove(idx, destinoImageIndex[idx] || 0)} title="Eliminar imagen">✕</button>
                              </div>
                              {item.previewUrls.length < 3 && (
                                <label className="admin-destino-preview__add-more">
                                  + Agregar imagen ({item.previewUrls.length}/3)
                                  <input type="file" accept="image/*" multiple onChange={(e) => handleDestinoImageAdd(idx, e.target.files, e.target)} style={{ display: 'none' }} />
                                </label>
                              )}
                            </>
                          ) : (
                            <label className="admin-destino-preview__upload">
                              <span className="admin-destino-preview__upload-icon">📷</span>
                              <span>Subir imágenes (máx. 3)</span>
                              <input type="file" accept="image/*" multiple onChange={(e) => handleDestinoImageAdd(idx, e.target.files, e.target)} style={{ display: 'none' }} />
                            </label>
                          )}
                        </div>

                        {/* Campos de texto */}
                        <div className="admin-destino-fields">
                          <label>
                            Destino
                            <input type="text" placeholder="ej: Miami" value={item.destino} onChange={(e) => handleDestinoChange(idx, 'destino', e.target.value)} required />
                          </label>
                          <label>
                            País
                            <input type="text" placeholder="ej: Estados Unidos de América" value={item.pais} onChange={(e) => handleDestinoChange(idx, 'pais', e.target.value)} required />
                          </label>
                          <label>
                            Precio Desde (USD)
                            <input type="number" min="0" step="1" placeholder="ej: 450" value={item.precio} onChange={(e) => handleDestinoChange(idx, 'precio', e.target.value)} onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()} required />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button type="button" className="admin-destinos-add-btn" onClick={addDestinoItem}>
                    <span className="admin-destinos-add-btn__icon">+</span>
                    <span>Agregar otro destino</span>
                  </button>
                </div>
              )}

              {/* ── Alojamientos (solo edicion de destinos) ── */}
              {isDestinosCategory && editingProductId && (
                <section className="admin-section admin-section-collapsible">
                  <div className="admin-collapsible-header" onClick={() => toggleSection("alojamientos")}>
                    <h2>🏨 Alojamientos</h2>
                    <span className={`admin-collapsible-arrow${expandedSections.alojamientos ? " admin-collapsible-arrow--open" : ""}`}>▼</span>
                  </div>
                  <div className={`admin-collapsible-body${expandedSections.alojamientos ? " admin-collapsible-body--open" : ""}`}>

                    {alojamientos.length === 0 && (
                      <p className="admin-help" style={{ marginBottom: "16px", color: "#666" }}>
                        No hay opciones de alojamiento registradas. Agrega una a continuacion.
                      </p>
                    )}

                    <div className="admin-alojamientos-list">
                      {alojamientos.map((item, idx) => (
                        <div key={idx} className="admin-alojamiento-card">
                          <div className="admin-alojamiento-card__header">
                            <span className="admin-alojamiento-card__number">{idx + 1}</span>
                            <span className="admin-alojamiento-card__label">{item.titulo || "Nuevo alojamiento"}</span>
                            <div className="admin-alojamiento-card__actions">
                              <button type="button" className="admin-btn-reorder" onClick={() => moveAlojamiento(idx, -1)} disabled={idx === 0} title="Subir">&#8593;</button>
                              <button type="button" className="admin-btn-reorder" onClick={() => moveAlojamiento(idx, 1)} disabled={idx === alojamientos.length - 1} title="Bajar">&#8595;</button>
                              <button type="button" className="admin-btn-delete" onClick={() => removeAlojamiento(idx)}>Quitar</button>
                            </div>
                          </div>

                          <div className="admin-alojamiento-card__body">
                            <div className="admin-alojamiento-fields">
                              <div className="admin-grid">
                                <label>
                                  Titulo
                                  <input type="text" value={item.titulo} onChange={(e) => handleAlojamientoChange(idx, "titulo", e.target.value)} placeholder="ej: Hotel Playa Dorada" />
                                </label>
                                <label>
                                  Precio (USD)
                                  <input type="number" min="0" step="0.01" value={item.precio} onChange={(e) => handleAlojamientoChange(idx, "precio", e.target.value)} placeholder="ej: 150" />
                                </label>
                                <label>
                                  Estrellas (1-5)
                                  <input type="number" min="1" max="5" step="1" value={item.estrellas} onChange={(e) => handleAlojamientoChange(idx, "estrellas", Number(e.target.value))} />
                                </label>
                                <label>
                                  Distancia centro
                                  <input type="text" value={item.distancia_centro} onChange={(e) => handleAlojamientoChange(idx, "distancia_centro", e.target.value)} placeholder="ej: 2.5 km" />
                                </label>
                                <label>
                                  Categoria
                                  <select value={item.categoria} onChange={(e) => handleAlojamientoChange(idx, "categoria", e.target.value)}>
                                    <option value="">Seleccionar</option>
                                    <option value="todo incluido">Todo incluido</option>
                                    <option value="solo alojamiento">Solo alojamiento</option>
                                    <option value="desayunos">Desayunos</option>
                                    <option value="media pension">Media pension</option>
                                  </select>
                                </label>
                                <label>
                                  Tipo habitacion
                                  <select value={item.tipo_habitacion} onChange={(e) => handleAlojamientoChange(idx, "tipo_habitacion", e.target.value)}>
                                    <option value="">Seleccionar</option>
                                    <option value="superior">Superior</option>
                                    <option value="primera calidad">Primera calidad</option>
                                    <option value="doble superior">Doble superior</option>
                                    <option value="doble premium">Doble premium</option>
                                  </select>
                                </label>
                                <label style={{ gridColumn: "1 / -1" }}>
                                  Enlace externo (Booking, Despegar, etc.)
                                  <input type="url" value={item.enlace_externo} onChange={(e) => handleAlojamientoChange(idx, "enlace_externo", e.target.value)} placeholder="https://..." />
                                </label>
                                <label style={{ gridColumn: "1 / -1" }}>
                                  Imagen principal
                                  <input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) handleAlojamientoImage(idx, file);
                                  }} />
                                </label>
                                <label style={{ gridColumn: "1 / -1" }}>
                                  Direccion
                                  <input type="text" value={item.direccion || ""} onChange={(e) => handleAlojamientoChange(idx, "direccion", e.target.value)} placeholder="ej: Av. Principal 123, Miami" />
                                </label>
                                <label>
                                  Latitud
                                  <input type="number" step="any" value={item.latitud || ""} onChange={(e) => handleAlojamientoChange(idx, "latitud", e.target.value)} placeholder="ej: 25.7617" />
                                </label>
                                <label>
                                  Longitud
                                  <input type="number" step="any" value={item.longitud || ""} onChange={(e) => handleAlojamientoChange(idx, "longitud", e.target.value)} placeholder="ej: -80.1918" />
                                </label>
                                <label style={{ gridColumn: "1 / -1" }}>
                                  Texto de venta
                                  <textarea rows={2} value={item.texto_venta || ""} onChange={(e) => handleAlojamientoChange(idx, "texto_venta", e.target.value)} placeholder="Frase corta para convencer al cliente..." />
                                </label>
                                <label style={{ gridColumn: "1 / -1" }}>
                                  Descripcion
                                  <textarea rows={3} value={item.descripcion || ""} onChange={(e) => handleAlojamientoChange(idx, "descripcion", e.target.value)} placeholder="Descripcion detallada del alojamiento..." />
                                </label>
                              </div>

                              {/* Arrays editables */}
                              <div className="admin-alojamiento-array-section">
                                <span className="admin-alojamiento-array-label">Tipos de habitacion</span>
                                {(item.tipos_habitacion || []).map((val, i) => (
                                  <div key={i} className="admin-alojamiento-array-row">
                                    <input type="text" value={val} onChange={(e) => handleAlojamientoArrayChange(idx, "tipos_habitacion", i, e.target.value)} placeholder="ej: Superior" />
                                    <button type="button" className="admin-btn-delete" onClick={() => removeAlojamientoArrayItem(idx, "tipos_habitacion", i)}>✕</button>
                                  </div>
                                ))}
                                <button type="button" className="admin-add-small" onClick={() => addAlojamientoArrayItem(idx, "tipos_habitacion")}>+ Agregar tipo</button>
                              </div>

                              <div className="admin-alojamiento-array-section">
                                <span className="admin-alojamiento-array-label">Tarifa incluye</span>
                                {(item.tarifa_incluye || []).map((val, i) => (
                                  <div key={i} className="admin-alojamiento-array-row">
                                    <input type="text" value={val} onChange={(e) => handleAlojamientoArrayChange(idx, "tarifa_incluye", i, e.target.value)} placeholder="ej: Desayuno incluido" />
                                    <button type="button" className="admin-btn-delete" onClick={() => removeAlojamientoArrayItem(idx, "tarifa_incluye", i)}>✕</button>
                                  </div>
                                ))}
                                <button type="button" className="admin-add-small" onClick={() => addAlojamientoArrayItem(idx, "tarifa_incluye")}>+ Agregar item</button>
                              </div>

                              <div className="admin-alojamiento-array-section">
                                <span className="admin-alojamiento-array-label">Servicios incluidos (solo texto)</span>
                                {(item.servicios_incluidos || []).map((val, i) => (
                                  <div key={i} className="admin-alojamiento-array-row">
                                    <input type="text" value={val} onChange={(e) => handleAlojamientoArrayChange(idx, "servicios_incluidos", i, e.target.value)} placeholder="ej: WiFi" />
                                    <button type="button" className="admin-btn-delete" onClick={() => removeAlojamientoArrayItem(idx, "servicios_incluidos", i)}>✕</button>
                                  </div>
                                ))}
                                <button type="button" className="admin-add-small" onClick={() => addAlojamientoArrayItem(idx, "servicios_incluidos")}>+ Agregar servicio</button>
                              </div>

                              {/* Galerías por tipo */}
                              {[
                                { key: "hotel", label: "Hotel" },
                                { key: "habitacion", label: "Habitaciones" },
                                { key: "comida", label: "Comida" },
                                { key: "servicio", label: "Servicios" },
                              ].map(({ key, label }) => (
                                <div key={key} className="admin-alojamiento-gallery">
                                  <span className="admin-alojamiento-array-label">Imagenes de {label}</span>
                                  <div className="admin-alojamiento-gallery-grid">
                                    {(item.galerias?.[key] || []).map((img, imgIdx) => (
                                      <div key={imgIdx} className="admin-alojamiento-gallery-thumb">
                                        <img src={img.previewUrl || img.imagen_url} alt={img.titulo || label} />
                                        <button
                                          type="button"
                                          className="admin-alojamiento-gallery-remove"
                                          onClick={() => removeAlojamientoGaleriaImage(idx, key, imgIdx, img.id)}
                                          title="Eliminar imagen"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                    <label className="admin-alojamiento-gallery-add">
                                      <span>+</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                          Array.from(e.target.files || []).forEach((file) =>
                                            handleAlojamientoGaleriaImage(idx, key, file)
                                          );
                                          e.target.value = "";
                                        }}
                                        style={{ display: "none" }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              ))}

                              {item.previewUrl && (
                                <div className="admin-alojamiento-img-preview">
                                  <img src={item.previewUrl} alt="Preview" />
                                </div>
                              )}
                              {item.imagen_url && !item.previewUrl && (
                                <div className="admin-alojamiento-img-preview">
                                  <img src={item.imagen_url} alt="Actual" />
                                  <span className="admin-alojamiento-img-label">Imagen actual</span>
                                </div>
                              )}
                            </div>

                            <div className="admin-alojamiento-preview">
                              <AlojamientoCard
                                compact
                                alojamiento={{
                                  titulo: item.titulo || "Vista previa",
                                  precio: item.precio ? parseNumber(item.precio) : null,
                                  imagen_url: item.previewUrl || item.imagen_url,
                                  estrellas: item.estrellas,
                                  distancia_centro: item.distancia_centro,
                                  categoria: item.categoria,
                                  tipo_habitacion: item.tipo_habitacion,
                                  enlace_externo: item.enlace_externo,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button type="button" className="admin-destinos-add-btn" onClick={addAlojamiento}>
                      <span className="admin-destinos-add-btn__icon">+</span>
                      <span>Agregar alojamiento</span>
                    </button>
                  </div>
                </section>
              )}
            </>
          )}

          {/* ── Mensajes ── */}
          {error && <div className="admin-error" role="alert">{error}</div>}
          {success && (
            <div className="admin-success" role="alert">
              <strong>Producto {success.modo} correctamente</strong>
              <ul className="admin-success-detail">
                <li><span>Nombre:</span> {success.titulo}</li>
                <li><span>Categoria:</span> {success.categoria}</li>
                <li><span>Ruta:</span> <code>{success.ruta}</code></li>
              </ul>
            </div>
          )}

          <button className="admin-submit" type="submit" disabled={loading || !canSubmit}>
            {submitBtnText}
          </button>
        </form>
      )}

      {/* ════════════════════════════════════════════════
          TAB: GESTIONAR PRODUCTOS
      ════════════════════════════════════════════════ */}
      {activeTab === "gestionar" && (
        <div className="admin-gestionar">
          <div className="admin-gestionar-header">
            <p>
              {gestionarCategoriaId
                ? `${productosFiltrados.length} de ${productosLista.length} productos`
                : `${productosLista.length} productos en total`}
            </p>
            <button className="admin-add" onClick={loadProductosAdmin} disabled={loadingLista}>
              {loadingLista ? "Cargando..." : "Actualizar lista"}
            </button>
          </div>

          <div className="admin-filters">
            <div className="admin-filter-group">
              <label htmlFor="admin-gestionar-categoria">Categoría</label>
              <select
                id="admin-gestionar-categoria"
                value={gestionarCategoriaId}
                onChange={(e) => setGestionarCategoriaId(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            <div className="admin-search">
              <input
                type="text"
                placeholder="Buscar por titulo o categoria..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
          </div>

          {(gestionarCategoriaId || productSearch) && productosFiltrados.length > 0 && (
            <p className="admin-filter-info">
              Mostrando <strong>{productosFiltrados.length}</strong> de {productosLista.length} productos
            </p>
          )}

          {error && <div className="admin-error">{error}</div>}

          {loadingLista ? (
            <div className="admin-product-list">
              {[1, 2, 3].map((n) => (
                <div className="admin-skeleton-card" key={n}>
                  <div className="admin-skeleton admin-skeleton--thumb" />
                  <div className="admin-skeleton-card-body">
                    <div className="admin-skeleton admin-skeleton--text" />
                    <div className="admin-skeleton admin-skeleton--text-short" />
                  </div>
                  <div className="admin-skeleton admin-skeleton--btn" />
                  <div className="admin-skeleton admin-skeleton--btn" />
                </div>
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">{productSearch ? "🔍" : "📦"}</div>
              <div className="admin-empty-state-title">
                {productSearch || gestionarCategoriaId ? "Sin resultados" : "No hay productos aun"}
              </div>
              <p className="admin-empty-state-desc">
                {productSearch || gestionarCategoriaId
                  ? `No se encontraron productos${productSearch ? ` que coincidan con "${productSearch}"` : ""}${gestionarCategoriaId ? ` en la categoría seleccionada` : ""}.`
                  : "Crea tu primer producto desde la pestana Crear."}
              </p>
            </div>
          ) : (
            <div className="admin-product-list">
              {productosFiltrados.map((p) => (
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
                    <button
                      className="admin-btn-delete"
                      onClick={() => setShowDeleteModal(p.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
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
            <div>
              <div className="admin-skeleton admin-skeleton-inbox" />
              <div className="admin-skeleton admin-skeleton-inbox" />
              <div className="admin-skeleton admin-skeleton-inbox" />
            </div>
          ) : contactosList.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">✉️</div>
              <div className="admin-empty-state-title">No hay mensajes aun</div>
              <p className="admin-empty-state-desc">Los mensajes del formulario de contacto apareceran aqui.</p>
            </div>
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
            <div>
              <div className="admin-skeleton admin-skeleton-inbox" />
              <div className="admin-skeleton admin-skeleton-inbox" />
              <div className="admin-skeleton admin-skeleton-inbox" />
            </div>
          ) : reservasList.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">📅</div>
              <div className="admin-empty-state-title">No hay solicitudes de reserva aun</div>
              <p className="admin-empty-state-desc">Las reservas realizadas por los clientes apareceran aqui.</p>
            </div>
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
            <div>
              <div className="admin-skeleton admin-skeleton-inbox" />
              <div className="admin-skeleton admin-skeleton-inbox" />
              <div className="admin-skeleton admin-skeleton-inbox" />
            </div>
          ) : suscripcionesList.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-icon">🔄</div>
              <div className="admin-empty-state-title">No hay suscripciones registradas aun</div>
              <p className="admin-empty-state-desc">Las suscripciones de los usuarios apareceran aqui.</p>
            </div>
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

      {/* ── Modal de confirmacion de eliminacion ── */}
      {showDeleteModal && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-icon">🗑️</div>
            <div className="admin-modal-title">Eliminar producto</div>
            <div className="admin-modal-desc">
              Esta accion no se puede deshacer. Se eliminara el producto y todos sus datos asociados (detalles, itinerarios).
            </div>
            <div className="admin-modal-actions">
              <button
                className="admin-modal-btn admin-modal-btn--cancel"
                onClick={() => setShowDeleteModal(null)}
              >
                Cancelar
              </button>
              <button
                className="admin-modal-btn admin-modal-btn--danger"
                onClick={() => {
                  handleDelete(showDeleteModal);
                  setShowDeleteModal(null);
                }}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Si, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AdminPanel;
