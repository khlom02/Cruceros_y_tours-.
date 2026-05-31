#!/bin/bash

# Script para subir imágenes a Supabase Storage usando API REST
# Requiere: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env

set -e

# Cargar variables de .env
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | xargs)
fi

SUPABASE_URL="$VITE_SUPABASE_URL"
ANON_KEY="$VITE_SUPABASE_ANON_KEY"
BUCKET="content media"

if [ -z "$SUPABASE_URL" ] || [ -z "$ANON_KEY" ]; then
  echo "❌ Error: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no encontrados en .env"
  exit 1
fi

echo "🚀 Iniciando carga de imágenes a Supabase Storage..."
echo "URL: $SUPABASE_URL"
echo "Bucket: $BUCKET"
echo ""

# Función para subir archivo
upload_file() {
  local file_path="$1"
  local remote_path="$2"
  local file_name=$(basename "$file_path")
  
  if [ ! -f "$file_path" ]; then
    echo "⚠️  Archivo no encontrado: $file_path"
    return 1
  fi

  # Calcular Content-Type
  local content_type="application/octet-stream"
  case "${file_name##*.}" in
    jpg|jpeg) content_type="image/jpeg" ;;
    png) content_type="image/png" ;;
    gif) content_type="image/gif" ;;
    mp4) content_type="video/mp4" ;;
    svg) content_type="image/svg+xml" ;;
  esac

  # Hacer la petición curl
  local encoded_bucket=$(echo -n "$BUCKET" | jq -sRr @uri)
  local response=$(curl -s -X POST \
    "$SUPABASE_URL/storage/v1/object/$encoded_bucket/$remote_path" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "Content-Type: $content_type" \
    --data-binary "@$file_path")

  # Verificar si fue exitoso
  if echo "$response" | grep -q '"name"'; then
    echo "✅ $file_name"
    return 0
  else
    echo "⚠️  $file_name: Error al subir"
    echo "   Respuesta: $response"
    return 1
  fi
}

# Subir archivos desde public/imagenes
if [ -d "public/imagenes" ]; then
  echo "📁 Subiendo archivos desde public/imagenes/..."
  for file in public/imagenes/*; do
    if [ -f "$file" ]; then
      upload_file "$file" "imagenes/$(basename "$file")"
    fi
  done
fi

# Subir archivos desde public/assets
if [ -d "public/assets" ]; then
  echo ""
  echo "📁 Subiendo archivos desde public/assets/..."
  for file in public/assets/*; do
    if [ -f "$file" ]; then
      upload_file "$file" "assets/$(basename "$file")"
    fi
  done
fi

echo ""
echo "✅ ¡Carga completada!"
echo ""
echo "Las imágenes están disponibles en:"
echo "https://$SUPABASE_URL/storage/v1/object/public/$BUCKET/imagenes/[nombre-archivo]"
