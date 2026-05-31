import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Cargar .env
dotenv.config();

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const bucketName = "content media";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para subir archivos
async function uploadImages() {
  const imagePath = path.join(__dirname, "../public/imagenes");
  const assetsPath = path.join(__dirname, "../public/assets");

  try {
    console.log("🚀 Iniciando carga de imágenes a Supabase Storage...\n");

    // Cargar imagenes
    await uploadFilesFromDirectory(imagePath, "imagenes");

    // Cargar assets
    await uploadFilesFromDirectory(assetsPath, "assets");

    console.log("\n✅ ¡Carga completada!");
  } catch (error) {
    console.error("❌ Error durante la carga:", error.message);
    process.exit(1);
  }
}

async function uploadFilesFromDirectory(dirPath, subfolder) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Carpeta no encontrada: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isFile()) {
      await uploadFile(filePath, `${subfolder}/${file}`);
    }
  }
}

async function uploadFile(filePath, remotePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(remotePath, fileContent, {
        cacheControl: "3600",
        upsert: true, // Sobrescribir si existe
      });

    if (error) {
      console.log(`⚠️  ${fileName}: ${error.message}`);
    } else {
      console.log(`✅ ${fileName}`);
    }
  } catch (error) {
    console.log(`❌ Error subiendo ${path.basename(filePath)}: ${error.message}`);
  }
}

uploadImages();
