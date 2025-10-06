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
