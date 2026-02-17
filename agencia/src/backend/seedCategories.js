import { supabase } from "./supabase_client.js";

/**
 * Script para insertar categorías iniciales en la BD
 * Ejecutar una sola vez: node src/backend/seedCategories.js
 */

const categorias = [
  { nombre: "Cruceros", descripcion: "Viajes en crucero" },
  { nombre: "Vuelos", descripcion: "Vuelos y transporte aéreo" },
  { nombre: "Tours", descripcion: "Paquetes turísticos y tours" },
  { nombre: "Destinos", descripcion: "Destinos turísticos" },
  { nombre: "Trenes", descripcion: "Viajes en tren" },
  { nombre: "Vehículos", descripcion: "Alquiler de vehículos" },
  { nombre: "Asistencia", descripcion: "Servicios de asistencia al viajero" },
];

async function seedCategories() {
  console.log("🌱 Iniciando inserción de categorías...");

  for (const categoria of categorias) {
    try {
      // Verificar si ya existe
      const { data: existing } = await supabase
        .from("categorias")
        .select("id")
        .eq("nombre", categoria.nombre)
        .single();

      if (existing) {
        console.log(`✅ ${categoria.nombre} ya existe, omitiendo...`);
        continue;
      }

      // Insertar nueva categoría
      const { data, error } = await supabase
        .from("categorias")
        .insert([categoria])
        .select();

      if (error) {
        console.error(`❌ Error al insertar ${categoria.nombre}:`, error);
      } else {
        console.log(`✅ ${categoria.nombre} insertado correctamente (ID: ${data[0].id})`);
      }
    } catch (err) {
      console.error(`❌ Error inesperado con ${categoria.nombre}:`, err);
    }
  }

  console.log("✨ Proceso completado");
}

seedCategories();
