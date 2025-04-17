import fs from "fs";
import path from "path";

export function getPhotoFilenames(): string[] {
  const imagesDir = path.join(process.cwd(), "public/images/photos");

  // Read all files in the directory
  const files = fs.readdirSync(imagesDir);

  // Only return image files
  return files.filter((file) => /\.(jpe?g|png|gif|webp)$/i.test(file));
}
