import { gql } from "@apollo/client";

export const ADD_USERS_TO_CHATROOM=gql`
    mutation addUsersToChatroom($chatroomId:Float!, $userIds:[Float!]!){
        addUsersToChatroom(chatroomId:$chatroomId,userIds:$userIds){
            name
            id
        }
    }
`