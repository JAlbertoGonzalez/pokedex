import { gql } from "graphql-request";

export const getGenerationsQuery = gql`
  query getGenerationsWithRegion {
    generation(order_by: { id: asc }) {
      id
      slug: name
      es: generationnames(where: { language: { name: { _eq: "es" } } }, limit: 1) {
        name
      }
      region {
        id
        slug: name
        en: regionnames(where: { language: { name: { _eq: "en" } } }, limit: 1) {
          name
        }
      }
    }
  }
`;


// NOTA: Para los regionnames uso los nombres en inglés "en" porque:
// 1. No hay nombres de región en español disponibles en la API.
// 2. Los nombres en inglés son los mismos que en español (no hay traducción)