import { gql } from "graphql-request";

export const getLanguagesQuery = gql`
  query Languages {
    language(where: { id: { _in: [1, 7, 9] } }) {
      id
      name
      languagenames {
        local_language_id
        name
      }
    }
  }
`;
