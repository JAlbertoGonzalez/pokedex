import { gql } from "graphql-request";

export const getGenerationsQuery = gql`
  query getGenerations {
    generation {
      name
      region_id
      id
      region {
        name
      }
    }
  }
`;
