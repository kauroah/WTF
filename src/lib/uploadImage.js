import { supabase } from "@/api/supabaseClient";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const PDF_TYPE = "application/pdf";

const IMAGE_MAX = 10 * 1024 * 1024;
const PDF_MAX = 25 * 1024 * 1024;

const STORAGE_BUCKET = "uploads";

export function checkImage(file) {
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Поддерживаются JPG, PNG и WebP";
  }

  if (file.size > IMAGE_MAX) {
    return "Изображение больше 10 МБ";
  }

  return null;
}

export function checkFile(file) {
  if (file.type === PDF_TYPE) {
    if (file.size > PDF_MAX) {
      return "PDF больше 25 МБ";
    }

    return null;
  }

  return checkImage(file);
}

export function fileType(file) {
  return file.type === PDF_TYPE ||
    (file.name || "").toLowerCase().endsWith(".pdf")
    ? "pdf"
    : "image";
}

export function typeFromUrl(url = "") {
  return url
    .toLowerCase()
    .split("?")[0]
    .endsWith(".pdf")
    ? "pdf"
    : "image";
}

/**
 * Creates a safe unique storage path.
 */
function createFilePath(file, folder = "files") {
  const extension =
    file.name?.split(".").pop()?.toLowerCase() ||
    (file.type === PDF_TYPE ? "pdf" : "jpg");

  const safeName =
    file.name
      ?.replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase() || "file";

  const uniqueId = crypto.randomUUID();

  return `${folder}/${uniqueId}-${safeName}.${extension}`;
}

/**
 * Uploads a file to Supabase Storage
 * and returns its public URL.
 */
async function uploadToStorage(file, folder) {
  const path = createFilePath(file, folder);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("File upload failed:", uploadError);
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  if (!publicUrl) {
    throw new Error("Не удалось получить URL загруженного файла");
  }

  return publicUrl;
}

export async function uploadImage(file) {
  const validationError = checkImage(file);

  if (validationError) {
    throw new Error(validationError);
  }

  return uploadToStorage(file, "images");
}

export async function uploadFile(file) {
  const validationError = checkFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const folder =
    fileType(file) === "pdf"
      ? "documents"
      : "images";

  return uploadToStorage(file, folder);
}