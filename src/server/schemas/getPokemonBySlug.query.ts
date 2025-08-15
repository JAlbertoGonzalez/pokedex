import { gql } from "graphql-request";
import { PokemonPayload } from "./getAllInfinite.query";

export const PokemonBySlug = gql /* GraphQL */ `
  query PokemonBySlug($name: String!, $lang: String! = "es") {
    pokemon(
      where: { is_default: { _eq: true }, name: { _eq: $name } }
      order_by: { id: asc }
      limit: 1
      offset: 0
    ) {
      ...PokemonPayload
    }
  }
  ${PokemonPayload}
`;
