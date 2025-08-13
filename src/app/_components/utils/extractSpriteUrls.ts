// Extrae recursivamente todas las URLs de sprites de un objeto
export function extractSpriteUrls(obj: unknown, prefix = ""): { label: string; url: string }[] {
  let result: { label: string; url: string }[] = [];
  if (!obj || typeof obj !== "object") return result;
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === "string" && value.startsWith("http")) {
      const fullPath = (prefix ? prefix + "/" : "") + key.replace(/_/g, " ");
      const parts = fullPath.split("/").map(s => s.trim()).filter(Boolean);
      const shortLabel = parts.slice(-2).join("/");
      result.push({ label: shortLabel, url: value });
    } else if (typeof value === "object" && value !== null) {
      result = result.concat(extractSpriteUrls(value, (prefix ? prefix + "/" : "") + key.replace(/_/g, " ")));
    }
  }
  return result;
}
