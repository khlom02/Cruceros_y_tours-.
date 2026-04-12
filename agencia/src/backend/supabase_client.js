import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// OBTENER CATEGORÍAS
// ============================================
export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .select("id, nombre, descripcion");

    if (error) {
      console.error("Error al obtener categorías:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener categorías:", err);
    return [];
  }
};

// ============================================
// OBTENER PRODUCTOS POR CATEGORÍA
// ============================================
export const fetchProductsByCategory = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("id, titulo, descripcion, precio, imagen, ubicacion, rating, fecha_inicio, fecha_fin, color_fondo")
      .eq("categoria_id", categoryId)
      .eq("activo", true)
      .order("fecha_creacion", { ascending: false });

    if (error) {
      console.error("Error al obtener productos por categoría:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener productos por categoría:", err);
    return [];
  }
};

// ============================================
// OBTENER TODOS LOS PRODUCTOS
// ============================================
export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("id, titulo, descripcion, precio, imagen, imagen_url, ubicacion, rating, cantidad_reviews, categoria_id, fecha_inicio, fecha_fin, color_fondo")
      .eq("activo", true)
      .order("fecha_creacion", { ascending: false });

    if (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener productos:", err);
    return [];
  }
};

// ============================================
// OBTENER PRODUCTO POR ID CON DETALLES COMPLETOS
// ============================================
export const fetchProductById = async (id) => {
  try {
    // Obtener producto base
    const { data: producto, error: errorProducto } = await supabase
      .from("productos")
      .select("id, titulo, descripcion, precio, imagen, imagen_url, ubicacion, rating, cantidad_reviews, categoria_id, fecha_inicio, fecha_fin")
      .eq("id", id)
      .single();

    if (errorProducto) {
      console.error("Error al obtener producto:", errorProducto);
      return null;
    }

    // Obtener detalles específicos de cruceros (si aplica)
    const { data: detallesCrucero } = await supabase
      .from("detalles_cruceros")
      .select("*")
      .eq("producto_id", id)
      .maybeSingle();

    // Obtener galerías
    const { data: galleries } = await supabase
      .from("galleries")
      .select("id, imagen_url, posicion_orden")
      .eq("producto_id", id)
      .order("posicion_orden", { ascending: true });

    // Obtener habitaciones
    const { data: rooms } = await supabase
      .from("rooms")
      .select("id, titulo, descripcion, precio, imagen_url")
      .eq("producto_id", id)
      .order("id", { ascending: true });

    // Obtener amenidades
    const { data: amenities } = await supabase
      .from("amenities")
      .select("id, nombre, icono_emoji")
      .eq("producto_id", id);

    // Obtener highlights
    const { data: highlights } = await supabase
      .from("highlights")
      .select("id, descripcion")
      .eq("producto_id", id)
      .order("posicion_orden", { ascending: true });

    return {
      ...producto,
      detalles_crucero: detallesCrucero || {},
      gallery: galleries?.map(g => g.imagen_url) || [],
      rooms: rooms || [],
      amenities: amenities || [],
      highlights: highlights?.map(h => h.descripcion) || [],
    };
  } catch (err) {
    console.error("Error inesperado al obtener producto con detalles:", err);
    return null;
  }
};

// ============================================
// OBTENER GALERÍAS DE UN PRODUCTO
// ============================================
export const fetchGalleries = async (productId) => {
  try {
    const { data, error } = await supabase
      .from("galleries")
      .select("id, imagen_url, posicion_orden")
      .eq("producto_id", productId)
      .order("posicion_orden", { ascending: true });

    if (error) {
      console.error("Error al obtener galerías:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener galerías:", err);
    return [];
  }
};

// ============================================
// OBTENER HABITACIONES DE UN PRODUCTO
// ============================================
export const fetchRoomsForProduct = async (productId) => {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("id, titulo, descripcion, precio, imagen_url")
      .eq("producto_id", productId)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error al obtener habitaciones:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener habitaciones:", err);
    return [];
  }
};

// ============================================
// OBTENER AMENIDADES DE UN PRODUCTO
// ============================================
export const fetchAmenitiesForProduct = async (productId) => {
  try {
    const { data, error } = await supabase
      .from("amenities")
      .select("id, nombre, icono_emoji")
      .eq("producto_id", productId);

    if (error) {
      console.error("Error al obtener amenidades:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener amenidades:", err);
    return [];
  }
};

// ============================================
// OBTENER HIGHLIGHTS DE UN PRODUCTO
// ============================================
export const fetchHighlightsForProduct = async (productId) => {
  try {
    const { data, error } = await supabase
      .from("highlights")
      .select("id, descripcion")
      .eq("producto_id", productId)
      .order("posicion_orden", { ascending: true });

    if (error) {
      console.error("Error al obtener highlights:", error);
      return [];
    }

    return data?.map(h => h.descripcion) || [];
  } catch (err) {
    console.error("Error inesperado al obtener highlights:", err);
    return [];
  }
};

// ============================================
// OBTENER SERVICIO ESPECIAL POR ID O TIPO
// ============================================
export const fetchSpecialServiceByKey = async ({ id, tipo } = {}) => {
  try {
    let query = supabase
      .from("productos")
      .select("id, titulo, descripcion, precio, imagen, ubicacion, rating, cantidad_reviews");

    if (id) {
      query = query.eq("id", id).single();
    } else if (tipo) {
      // Buscar por nombre de categoría
      const { data: categoria } = await supabase
        .from("categorias")
        .select("id")
        .ilike("nombre", `%${tipo}%`)
        .single();

      if (!categoria) return null;

      query = query.eq("categoria_id", categoria.id).single();
    } else {
      return null;
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al obtener servicio especial:", error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("Error inesperado al obtener servicio especial:", err);
    return null;
  }
};

// ============================================
// FUNCIONES PARA PERFIL DE USUARIO
// ============================================
export const getUserProfile = async (usuarioId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", usuarioId)
      .single();

    if (error) {
      console.error("Error al obtener perfil:", error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("Error inesperado:", err);
    return null;
  }
};

// Actualizar perfil del usuario
export const updateUserProfile = async (usuarioId, perfil) => {
  try {
    // Nunca permitir que el frontend cambie campos de privilegio/identidad
    // eslint-disable-next-line no-unused-vars
    const { rol, id, email, created_at, ...camposPermitidos } = perfil;

    const { data, error } = await supabase
      .from("profiles")
      .update(camposPermitidos)
      .eq("id", usuarioId)
      .select()
      .single();

    if (error) {
      console.error("Error al actualizar perfil:", error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("Error inesperado:", err);
    return null;
  }
};

// ============================================
// OBTENER HABITACIONES (Para compatibilidad con rooms.jsx)
// ============================================
export const fetchRooms = async ({ serviceType } = {}) => {
  try {
    let query = supabase
      .from("rooms")
      .select("id, titulo, descripcion, precio, imagen_url, producto_id");

    // Si se proporciona serviceType, filtrar por tipo de servicio
    if (serviceType) {
      // Por ahora devolvemos todas las habitaciones
      // En futuro se puede expandir para filtrar por categoría
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al obtener habitaciones:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener habitaciones:", err);
    return [];
  }
};

// ============================================
// ADMIN: OBTENER TODOS LOS PRODUCTOS (sin filtro activo)
// ============================================
export const fetchAllProductsAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("id, titulo, precio, activo, categoria_id, imagen, color_fondo")
      .order("fecha_creacion", { ascending: false });

    if (error) {
      console.error("Error al obtener productos para admin:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener productos admin:", err);
    return [];
  }
};

// ============================================
// ADMIN: OBTENER PRODUCTO COMPLETO PARA EDICIÓN
// ============================================
export const fetchProductAdminById = async (id) => {
  try {
    const { data: producto, error: errorProducto } = await supabase
      .from("productos")
      .select("id, titulo, descripcion, precio, imagen, ubicacion, rating, cantidad_reviews, categoria_id, fecha_inicio, fecha_fin, color_fondo, activo")
      .eq("id", id)
      .single();

    if (errorProducto) {
      console.error("Error al obtener producto para edición:", errorProducto);
      return null;
    }

    const { data: detallesCrucero } = await supabase
      .from("detalles_cruceros")
      .select("*")
      .eq("producto_id", id)
      .maybeSingle();

    const { data: galleries } = await supabase
      .from("galleries")
      .select("id, imagen_url, posicion_orden")
      .eq("producto_id", id)
      .order("posicion_orden", { ascending: true });

    const { data: rooms } = await supabase
      .from("rooms")
      .select("id, titulo, descripcion, precio, imagen_url")
      .eq("producto_id", id)
      .order("id", { ascending: true });

    const { data: amenities } = await supabase
      .from("amenities")
      .select("id, nombre, icono_emoji")
      .eq("producto_id", id);

    const { data: highlights } = await supabase
      .from("highlights")
      .select("id, descripcion, posicion_orden")
      .eq("producto_id", id)
      .order("posicion_orden", { ascending: true });

    return {
      ...producto,
      detalles_crucero: detallesCrucero || null,
      gallery: galleries || [],
      rooms: rooms || [],
      amenities: amenities || [],
      highlights: highlights || [],
    };
  } catch (err) {
    console.error("Error inesperado al obtener producto admin:", err);
    return null;
  }
};

// ============================================
// ADMIN: ELIMINAR PRODUCTO Y DATOS RELACIONADOS
// ============================================
export const deleteProductAndRelated = async (id) => {
  try {
    await supabase.from("highlights").delete().eq("producto_id", id);
    await supabase.from("amenities").delete().eq("producto_id", id);
    await supabase.from("rooms").delete().eq("producto_id", id);
    await supabase.from("galleries").delete().eq("producto_id", id);
    await supabase.from("detalles_cruceros").delete().eq("producto_id", id);

    const { error } = await supabase.from("productos").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar producto:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error inesperado al eliminar producto:", err);
    return false;
  }
};

// ============================================
// FUNCIONES PARA CONTACTOS
// ============================================
export const createContact = async (nombre, email, telefono, asunto, mensaje) => {
  try {
    const { data, error } = await supabase
      .from("contactos")
      .insert({
        nombre,
        email,
        telefono,
        asunto,
        mensaje,
        estado: "nuevo",
      })
      .select()
      .single();

    if (error) {
      console.error("Error al crear contacto:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error inesperado:", err);
    return null;
  }
};

// ============================================
// CARRUSEL 3D — TOP CRUCEROS
// ============================================
export const fetchCarouselCruises = async (limit = 5) => {
  try {
    const { data: categoria } = await supabase
      .from("categorias")
      .select("id")
      .ilike("nombre", "Cruceros Destacados")
      .single();

    if (!categoria) return [];

    const { data, error } = await supabase
      .from("productos")
      .select("id, titulo, imagen_url, imagen, ubicacion")
      .eq("categoria_id", categoria.id)
      .eq("activo", true)
      .order("fecha_creacion", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error al obtener cruceros para carrusel:", error);
      return [];
    }

    return (data || []).map((p) => ({
      id: p.id,
      img: p.imagen_url || p.imagen || "",
      title: p.titulo,
      subtitle: p.ubicacion || "",
    }));
  } catch (err) {
    console.error("Error inesperado al obtener cruceros para carrusel:", err);
    return [];
  }
};

// ============================================
// NEWSLETTER
// ============================================
export const subscribeNewsletter = async (email) => {
  try {
    const { error } = await supabase
      .from("newsletter")
      .insert({ email })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return { success: false, msg: "Este email ya está suscrito." };
      console.error("Error newsletter:", error);
      return { success: false, msg: "Ocurrió un error. Intenta de nuevo." };
    }

    return { success: true };
  } catch (err) {
    console.error("Error inesperado newsletter:", err);
    return { success: false, msg: "Ocurrió un error. Intenta de nuevo." };
  }
};
