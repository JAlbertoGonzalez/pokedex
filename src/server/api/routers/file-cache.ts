// file-cache.ts
// Cache simple en disco usando el sistema de archivos
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.resolve(process.cwd(), 'cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

export function setCache(key: string, value: unknown) {
  const hashedKey = crypto.createHash('md5').update(key).digest('hex');
  const filePath = path.join(CACHE_DIR, hashedKey);
  fs.writeFileSync(filePath, JSON.stringify(value), 'utf8');
}

export function getCache<T>(key: string): T | undefined {
  const hashedKey = crypto.createHash('md5').update(key).digest('hex');
  const filePath = path.join(CACHE_DIR, hashedKey);
  if (!fs.existsSync(filePath)) return undefined;
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch {
    return undefined;
  }
}

export function clearCache(key: string) {
  const hashedKey = crypto.createHash('md5').update(key).digest('hex');
  const filePath = path.join(CACHE_DIR, hashedKey);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
