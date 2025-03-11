import { gql } from '@apollo/client';

export const USER_LEAVE_CHAT_GROUP = gql`
  subscription UserLeaveChatGroup($chatroomId: Float!,$userId:Float!) {
    userLeaveChatGroup(chatroomId: $chatroomId,userId:$userId) {
        id
        fullname
        avatarUrl
        email
    }
  }
`;