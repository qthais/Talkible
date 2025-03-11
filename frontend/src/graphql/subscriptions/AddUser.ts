import { gql } from "@apollo/client";

export const USER_IS_ADDED = gql`
  subscription UserIsAdded($userId: Float!) {
    userIsAddedToChatGroup(userId: $userId) {
        id
        fullname
        avatarUrl
        email
    }
  }
`;