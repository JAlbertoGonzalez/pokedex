export const searchSpeciesBySpanishNameQuery = `
  query searchSpeciesBySpanishName($regex: String!) {
    pokemon_v2_pokemonspecies(where: {name: {_regex: $regex}}) {
      id
      name
      names {
        name
        language {
          name
        }
      }
    }
  }
`;
