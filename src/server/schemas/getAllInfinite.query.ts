export const getAllInfiniteQuery = `
  query getPokemon($limit: Int, $offset: Int, $where: pokemon_bool_exp, $language: String!) {
    pokemon(limit: $limit, offset: $offset, where: $where) {
      id
      name
      pokemonsprites(limit: 1) {
        sprites
      }
      pokemontypes {
        type {
          name
          typenames(where: { language: { name: { _eq: $language } } }) {
            name
            language {
              name
            }
          }
        }
      }
    }
  }
`;
