import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// OBTENER PRODUCTOS
// ============================================
export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("id, nombre, descripcion, precio, imagen_url, stock, categoria_id, marca_id, fecha_creacion");

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
// OBTENER CATEGORÍAS
// ============================================
export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .select("id, nombre");

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
// OBTENER MARCAS
// ============================================
export const fetchBrands = async () => {
  try {
    const { data, error } = await supabase
      .from("marcas")
      .select("id, nombre");

    if (error) {
      console.error("Error al obtener marcas:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener marcas:", err);
    return [];
  }
};

// ============================================
// APLICAR FILTROS (CATEGORÍA + MARCA + BUSCAR)
// ============================================
export const applyFilters = async (filters) => {
  const { categoria, marca, buscar } = filters;

  try {
    let query = supabase
      .from("productos")
      .select("id, nombre, descripcion, precio, imagen_url, stock, categoria_id, marca_id, fecha_creacion");

    // Filtrar por categoría
    if (categoria && categoria !== "todos") {
      query = query.eq("categoria_id", categoria);
    }

    // Filtrar por marca
    if (marca && marca !== "todos") {
      query = query.eq("marca_id", marca);
    }

    // Filtro por texto (nombre del producto)
    if (buscar && buscar.trim() !== "") {
      query = query.ilike("nombre", `%${buscar}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al aplicar filtros:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al aplicar filtros:", err);
    return [];
  }
};

// ============================================
// OBTENER PRODUCTO POR ID
// ============================================
export const fetchProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("id, nombre, descripcion, precio, imagen_url, stock, categoria_id, marca_id, fecha_creacion")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error al obtener el producto por ID:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error inesperado al obtener el producto por ID:", err);
    return null;
  }
};

// ============================================
// OBTENER PRODUCTOS ALEATORIOS
// ============================================
export const fetchRandomProducts = async (limit = 4) => {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select("id, nombre, descripcion, precio, imagen_url, categoria_id")
      .order("id", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error al obtener productos aleatorios:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Error inesperado al obtener productos aleatorios:", err);
    return [];
  }
};

// ============================================
// OBTENER HABITACIONES
// ============================================
export const fetchRooms = async ({ serviceType } = {}) => {
  const timeoutMs = 2000;

  try {
    let query = supabase
      .from("rooms")
      .select("id, title, image_url, features, service_type");

    if (serviceType) {
      query = query.eq("service_type", serviceType);
    }

    const timeoutRace = new Promise((resolve) =>
      setTimeout(() => resolve(null), timeoutMs)
    );

    const result = await Promise.race([query, timeoutRace]);

    if (!result || result.error) {
      return [];
    }

    return result.data || [];
  } catch (err) {
    console.error("Error inesperado al obtener habitaciones:", err);
    return [];
  }
};

// ============================================
// OBTENER SERVICIO ESPECIAL POR ID O TIPO
// ============================================
export const fetchSpecialServiceByKey = async ({ id, tipo } = {}) => {
  try {
    let query = supabase
      .from("servicios_especiales")
      .select(
        "id, tipo, nombre, descripcion, ubicacion, rating, reviews, imagen_url, gallery, highlights, amenities, facilities, service_info, service_cta"
      );

    if (id) {
      query = query.eq("id", id).single();
    } else if (tipo) {
      query = query.eq("tipo", tipo).single();
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
