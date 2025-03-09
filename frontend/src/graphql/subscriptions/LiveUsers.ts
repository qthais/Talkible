import { gql } from "@apollo/client";

export const LIVE_USERS_SUBSCRIPTION= gql`
    subscription liveUsersInChatRoom($chatroomId:Float!){
        liveUsersInChatroom(chatroomId:$chatroomId){
            id
            fullname
            avatarUrl
            email
        }
    }
`