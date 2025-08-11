export const getPokemonQuery = `
  query getPokemon($limit: Int, $offset: Int) {
    pokemon(limit: $limit, offset: $offset) {
      id
      name
    }
  }
`;
