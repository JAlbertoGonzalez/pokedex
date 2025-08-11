export const getAllInfiniteQuery = `
  query getPokemon($limit: Int, $offset: Int, $where: pokemon_bool_exp) {
    pokemon(limit: $limit, offset: $offset, where: $where) {
      id
      name
      pokemonsprites {
        sprites
      }
      pokemontypes {
        type {
          name
          typenames {
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
