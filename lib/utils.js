const imageExtensions = ["jpg", "jpeg", "png", "webp", "avif"];

const videoExtensions = ["mp4", "mov", "avi", "mkv"];

const audioExtensions = ["mp3", "wav", "ogg"];
export function formatQuality(type, quality) {
  switch (type) {
    case "jpg":
    case "jpeg":
      return Math.ceil(remap(quality, 0, 100, 35, 1));
    case "webp":
      return Math.ceil(remap(quality, 0, 100, 0, 100));
    default:
      return quality;
  }
}

function remap(value, a, b, c, d) {
  return c + (value - a) * (d - c) / b - a;
}

export function rmExtension(name) {
  if (!name) return "";
  if (name.includes('.jpeg') || name.includes('.jpg') || name.includes('.png') || name.includes('.webp')) {
    return name.replace(/\.(jpeg|jpg|png|webp)$/i, '');
  }
  return name;
}

export function getExtensionType(name) {
  if (!name) return "";
  for (const ext of imageExtensions) {
    if (name.toLowerCase().endsWith(`.${ext}`)) {
      return "image";
    }
  }
  for (const ext of videoExtensions) {
    if (name.toLowerCase().endsWith(`.${ext}`)) {
      return "video";
    }
  }
  // for (const ext of audioExtensions) {
  //   if (name.toLowerCase().endsWith(`.${ext}`)) {
  //     return "audio";
  //   }
  // }
  return "none";
}