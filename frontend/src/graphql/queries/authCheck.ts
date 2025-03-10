import { gql } from '@apollo/client';

export const AUTH_CHECK = gql`
  query AuthCheck {
    authCheck {
        username
        sub
    }
  }
`;
