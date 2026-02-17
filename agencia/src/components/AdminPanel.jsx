import { useEffect, useMemo, useState } from "react";
import "../styles/admin.css";
import { supabase, fetchCategories } from "../backend/supabase_client";

const BUCKET_NAME = "content media";

const emptyRoom = { titulo: "", descripcion: "", precio: "", imagenFile: null };
const emptyAmenity = { nombre: "", icono_emoji: "" };
const emptyHighlight = { descripcion: "" };

const AdminPanel = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [producto, setProducto] = useState({
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
  });

  const [detalleCrucero, setDetalleCrucero] = useState({
    anos_servicio: "",
    pasajeros_max: "",
    tripulantes: "",
    ratio_espacio: "",
    ratio_servicio: "",
    cabina_single: false,
    viajando_con_ninos: false,
  });

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [rooms, setRooms] = useState([ { ...emptyRoom } ]);
  const [amenities, setAmenities] = useState([ { ...emptyAmenity } ]);
  const [highlights, setHighlights] = useState([ { ...emptyHighlight } ]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategorias(data || []);
    };

    loadCategories();
  }, []);

  const categoriaNombre = useMemo(() => {
    return categorias.find((cat) => String(cat.id) === String(producto.categoria_id))?.nombre || "";
  }, [categorias, producto.categoria_id]);

  const isCrucero = categoriaNombre.toLowerCase() === "cruceros";

  const handleProductoChange = (field, value) => {
    setProducto((prev) => ({ ...prev, [field]: value }));
  };

  const handleDetalleChange = (field, value) => {
    setDetalleCrucero((prev) => ({ ...prev, [field]: value }));
  };

  const updateListItem = (setter, index, field, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addListItem = (setter, item) => {
    setter((prev) => [...prev, { ...item }]);
  };

  const removeListItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file, folder) => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${folder}/${fileName}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      throw error;
    }

    const { data: publicUrl } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  const resetForm = () => {
    setProducto({
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
    });
    setDetalleCrucero({
      anos_servicio: "",
      pasajeros_max: "",
      tripulantes: "",
      ratio_espacio: "",
      ratio_servicio: "",
      cabina_single: false,
      viajando_con_ninos: false,
    });
    setGalleryFiles([]);
    setRooms([ { ...emptyRoom } ]);
    setAmenities([ { ...emptyAmenity } ]);
    setHighlights([ { ...emptyHighlight } ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!producto.titulo || !producto.categoria_id || !producto.precio) {
      setError("Titulo, categoria y precio son obligatorios.");
      return;
    }

    if (!producto.imagenFile) {
      setError("Debes subir una imagen principal.");
      return;
    }

    try {
      setLoading(true);

      const imagenUrl = await uploadFile(producto.imagenFile, "productos");

      const { data: productoInsertado, error: productoError } = await supabase
        .from("productos")
        .insert({
          titulo: producto.titulo,
          descripcion: producto.descripcion,
          precio: Number(producto.precio),
          imagen: imagenUrl,
          ubicacion: producto.ubicacion,
          rating: producto.rating ? Number(producto.rating) : null,
          cantidad_reviews: producto.cantidad_reviews ? Number(producto.cantidad_reviews) : null,
          fecha_inicio: producto.fecha_inicio || null,
          fecha_fin: producto.fecha_fin || null,
          color_fondo: producto.color_fondo,
          categoria_id: Number(producto.categoria_id),
          activo: Boolean(producto.activo),
        })
        .select()
        .single();

      if (productoError) {
        throw productoError;
      }

      const productoId = productoInsertado.id;

      if (isCrucero) {
        const { error: detalleError } = await supabase
          .from("detalles_cruceros")
          .insert({
            producto_id: productoId,
            anos_servicio: detalleCrucero.anos_servicio ? Number(detalleCrucero.anos_servicio) : null,
            pasajeros_max: detalleCrucero.pasajeros_max ? Number(detalleCrucero.pasajeros_max) : null,
            tripulantes: detalleCrucero.tripulantes ? Number(detalleCrucero.tripulantes) : null,
            ratio_espacio: detalleCrucero.ratio_espacio ? Number(detalleCrucero.ratio_espacio) : null,
            ratio_servicio: detalleCrucero.ratio_servicio ? Number(detalleCrucero.ratio_servicio) : null,
            cabina_single: detalleCrucero.cabina_single,
            viajando_con_ninos: detalleCrucero.viajando_con_ninos,
          });

        if (detalleError) {
          throw detalleError;
        }
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

        const { error: galleryError } = await supabase
          .from("galleries")
          .insert(galleryRows);

        if (galleryError) {
          throw galleryError;
        }
      }

      const roomRows = rooms
        .filter((room) => room.titulo && room.descripcion && room.precio)
        .map(async (room) => {
          let roomImageUrl = null;
          if (room.imagenFile) {
            roomImageUrl = await uploadFile(room.imagenFile, `productos/${productoId}/rooms`);
          }

          return {
            producto_id: productoId,
            titulo: room.titulo,
            descripcion: room.descripcion,
            precio: Number(room.precio),
            imagen_url: roomImageUrl,
          };
        });

      if (roomRows.length > 0) {
        const roomPayload = await Promise.all(roomRows);
        const { error: roomsError } = await supabase
          .from("rooms")
          .insert(roomPayload);

        if (roomsError) {
          throw roomsError;
        }
      }

      const amenityRows = amenities
        .filter((amenity) => amenity.nombre)
        .map((amenity) => ({
          producto_id: productoId,
          nombre: amenity.nombre,
          icono_emoji: amenity.icono_emoji || null,
        }));

      if (amenityRows.length > 0) {
        const { error: amenityError } = await supabase
          .from("amenities")
          .insert(amenityRows);

        if (amenityError) {
          throw amenityError;
        }
      }

      const highlightRows = highlights
        .filter((highlight) => highlight.descripcion)
        .map((highlight, index) => ({
          producto_id: productoId,
          descripcion: highlight.descripcion,
          posicion_orden: index + 1,
        }));

      if (highlightRows.length > 0) {
        const { error: highlightError } = await supabase
          .from("highlights")
          .insert(highlightRows);

        if (highlightError) {
          throw highlightError;
        }
      }

      setSuccess("Producto creado correctamente.");
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Ocurrio un error al guardar. Revisa permisos y campos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administracion</h1>
        <p>Crear productos, detalles y contenido del catalogo.</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <section className="admin-section">
          <h2>Producto</h2>

          <label>
            Titulo
            <input
              type="text"
              value={producto.titulo}
              onChange={(e) => handleProductoChange("titulo", e.target.value)}
              required
            />
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
            <label>
              Precio
              <input
                type="number"
                step="0.01"
                value={producto.precio}
                onChange={(e) => handleProductoChange("precio", e.target.value)}
                required
              />
            </label>

            <label>
              Categoria
              <select
                value={producto.categoria_id}
                onChange={(e) => handleProductoChange("categoria_id", e.target.value)}
                required
              >
                <option value="">Selecciona</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
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

            <label>
              Rating
              <input
                type="number"
                step="0.1"
                value={producto.rating}
                onChange={(e) => handleProductoChange("rating", e.target.value)}
              />
            </label>

            <label>
              Reviews
              <input
                type="number"
                value={producto.cantidad_reviews}
                onChange={(e) => handleProductoChange("cantidad_reviews", e.target.value)}
              />
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

          <label>
            Imagen principal (subir archivo)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleProductoChange("imagenFile", e.target.files[0])}
              required
            />
          </label>
        </section>

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

        <section className="admin-section">
          <h2>Galeria</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
          />
          {galleryFiles.length > 0 && (
            <p className="admin-help">{galleryFiles.length} imagenes seleccionadas</p>
          )}
        </section>

        <section className="admin-section">
          <h2>Rooms</h2>
          {rooms.map((room, index) => (
            <div className="admin-list" key={`room-${index}`}>
              <input
                type="text"
                placeholder="Titulo"
                value={room.titulo}
                onChange={(e) => updateListItem(setRooms, index, "titulo", e.target.value)}
              />
              <input
                type="text"
                placeholder="Descripcion"
                value={room.descripcion}
                onChange={(e) => updateListItem(setRooms, index, "descripcion", e.target.value)}
              />
              <input
                type="number"
                placeholder="Precio"
                value={room.precio}
                onChange={(e) => updateListItem(setRooms, index, "precio", e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateListItem(setRooms, index, "imagenFile", e.target.files[0])}
              />
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

        <section className="admin-section">
          <h2>Amenities</h2>
          {amenities.map((amenity, index) => (
            <div className="admin-list" key={`amenity-${index}`}>
              <input
                type="text"
                placeholder="Nombre"
                value={amenity.nombre}
                onChange={(e) => updateListItem(setAmenities, index, "nombre", e.target.value)}
              />
              <input
                type="text"
                placeholder="Icono emoji"
                value={amenity.icono_emoji}
                onChange={(e) => updateListItem(setAmenities, index, "icono_emoji", e.target.value)}
              />
              {amenities.length > 1 && (
                <button type="button" onClick={() => removeListItem(setAmenities, index)}>
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button type="button" className="admin-add" onClick={() => addListItem(setAmenities, emptyAmenity)}>
            + Agregar amenity
          </button>
        </section>

        <section className="admin-section">
          <h2>Highlights</h2>
          {highlights.map((highlight, index) => (
            <div className="admin-list" key={`highlight-${index}`}>
              <input
                type="text"
                placeholder="Descripcion"
                value={highlight.descripcion}
                onChange={(e) => updateListItem(setHighlights, index, "descripcion", e.target.value)}
              />
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

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        <button className="admin-submit" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear producto"}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
