import NodeCache from "node-cache";

// TTL de 1 hora
export const pokemonCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
