import { gql } from '@apollo/client';

export const GET_CHATROOM_DETAILS = gql`
  query GetChatroomDetails($chatroomId: Float!) {
    getChatroom(chatroomId: $chatroomId) {
      id
      name
    }
  }
`;
