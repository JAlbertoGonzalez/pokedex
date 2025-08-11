import { gql } from "graphql-request";

export const getLanguagesQuery = gql`
  query Languages {
    language {
      id
      name
      languagenames {
        id
        name
      }
    }
  }
`;
