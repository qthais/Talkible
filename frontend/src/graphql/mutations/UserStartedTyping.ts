import { gql } from "@apollo/client";

export const USER_STARTED_TYPING_MUTATION = gql`
  mutation userStartedTypingMutation($chatroomId: Float!) {
    userStartedTypingMutation(chatroomId: $chatroomId) {
      id
      fullname
      email
    }
  }
`;
