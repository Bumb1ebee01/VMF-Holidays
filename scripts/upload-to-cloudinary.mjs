import { v2 as cloudinary } from "cloudinary";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Load .env manually (no dotenv needed)
const envPath = join(dirname(fileURLToPath(import.meta.url)), "../.env");
const envContent = readFileSync(envPath, "utf8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (match) process.env[match[1]] = match[2];
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "../public");

function walkImages(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkImages(full));
    } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

const images = walkImages(publicDir);
const mapping = {};

for (const filePath of images) {
  const rel = relative(publicDir, filePath).replace(/\\/g, "/");
  // public_id = vmf-holidays/<rel without extension>
  const publicId = "vmf-holidays/" + rel.replace(/\.[^.]+$/, "");
  process.stdout.write(`Uploading ${rel} ... `);
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  mapping[`/${rel}`] = result.secure_url;
  console.log("✓");
}

console.log("\n=== URL MAPPING ===");
for (const [local, url] of Object.entries(mapping)) {
  console.log(`${local} → ${url}`);
}

// Write mapping to a JSON file for reference
import { writeFileSync } from "fs";
writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "cloudinary-mapping.json"),
  JSON.stringify(mapping, null, 2)
);
console.log("\nMapping saved to scripts/cloudinary-mapping.json");
