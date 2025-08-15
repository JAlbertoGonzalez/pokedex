// file-cache.ts
// Cache simple en disco usando el sistema de archivos
import crypto from "crypto";
import fs from "fs";
import path from "path";

const CACHE_TTL = 1000 * 60 * 60 * 24; // 1 día
const CACHE_DIR = path.resolve(process.cwd(), "cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

export function setCache(category: string, key: string, value: unknown) {
  const filePath = path.join(CACHE_DIR, `${category}_${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

export function getCache<T>(category: string, key: string): T | undefined {
  const filePath = path.join(CACHE_DIR, `${category}_${key}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  const lastModified = fs.statSync(filePath).mtimeMs;
  if (lastModified < Date.now() - CACHE_TTL) return undefined;
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch {
    return undefined;
  }
}

export function setSearchCache(key: string, value: unknown) {
  const hashedKey = crypto.createHash("md5").update(key).digest("hex");
  setCache("search", hashedKey, value);
}

export function getSearchCache<T>(key: string): T | undefined {
  const hashedKey = crypto.createHash("md5").update(key).digest("hex");
  return getCache<T>("search", hashedKey);
}

export function setPokemonCache(key: string, value: unknown) {
  setCache("pkmn", key, value);
}

export function getPokemonCache<T>(key: string): T | undefined {
  return getCache<T>("pkmn", key);
}
