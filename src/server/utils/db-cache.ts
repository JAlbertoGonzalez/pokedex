import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function setDbCache(key: string, value: string) {
  await prisma.cacheEntry.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getDbCache<T = unknown>(key: string): Promise<T | null> {
  const entry = await prisma.cacheEntry.findUnique({ where: { key } });
  return entry ? (entry.value as T) : null;
}

export async function clearDbCache(key: string) {
  await prisma.cacheEntry.deleteMany({ where: { key } });
}

export async function clearAllDbCache() {
  await prisma.cacheEntry.deleteMany({});
}
