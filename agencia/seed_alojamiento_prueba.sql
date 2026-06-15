-- Seed de prueba para verificar detalles_alojamiento.jsx
-- Reemplaza PRODUCTO_ID_AQUI por el id de un producto existente en tu tabla productos.

INSERT INTO alojamientos (
  producto_id,
  titulo,
  precio,
  imagen_url,
  estrellas,
  distancia_centro,
  categoria,
  tipo_habitacion,
  descripcion,
  direccion,
  latitud,
  longitud,
  texto_venta,
  servicios_incluidos,
  tarifa_incluye,
  tipos_habitacion,
  posicion_orden
) VALUES (
  PRODUCTO_ID_AQUI,
  'Hotel Paraíso Caribeño',
  185,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
  5,
  '1.2 km',
  'todo incluido',
  'doble premium',
  'Un refugio frente al mar con instalaciones de primera clase, ideal para desconectar y disfrutar del Caribe. Cuenta con piscinas infinity, restaurantes temáticos y actividades para toda la familia.',
  'Av. Playa Azul 123, Cancún, México',
  21.1619,
  -86.8515,
  'Reserva hoy y vive una experiencia todo incluido con vista al mar. ¡Tarifas especiales por tiempo limitado!',
  '["WiFi", "Aparcamiento", "Piscina", "Aire acondicionado", "Servicio de lavandería"]',
  '["Desayuno buffet", "Impuestos", "Acceso a la playa", "WiFi premium"]',
  '["Superior", "Doble superior", "Doble premium", "Suite junior"]',
  0
)
RETURNING id;

-- Después de ejecutar el INSERT anterior, toma el id devuelto y reemplaza ALOJAMIENTO_ID_AQUI
-- en las siguientes sentencias.

INSERT INTO alojamiento_imagenes (alojamiento_id, tipo, imagen_url, titulo, posicion_orden) VALUES
(ALOJAMIENTO_ID_AQUI, 'hotel', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', 'Vista general', 0),
(ALOJAMIENTO_ID_AQUI, 'hotel', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', 'Lobby', 1),
(ALOJAMIENTO_ID_AQUI, 'hotel', 'https://images.unsplash.com/photo-1571896349842-c33d57733427?w=800&q=80', 'Piscina', 2),
(ALOJAMIENTO_ID_AQUI, 'habitacion', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', 'Habitación premium', 0),
(ALOJAMIENTO_ID_AQUI, 'habitacion', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', 'Suite', 1),
(ALOJAMIENTO_ID_AQUI, 'habitacion', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80', 'Vista desde la habitación', 2),
(ALOJAMIENTO_ID_AQUI, 'comida', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', 'Restaurante principal', 0),
(ALOJAMIENTO_ID_AQUI, 'comida', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', 'Cena gourmet', 1),
(ALOJAMIENTO_ID_AQUI, 'comida', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', 'Desayuno buffet', 2);
