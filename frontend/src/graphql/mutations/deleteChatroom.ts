import { gql } from "@apollo/client";

export const DELETE_CHATROOM=gql`
    mutation deleteChatroom($chatroomId:Float!){
        deleteChatroom(chatroomId:$chatroomId)
    }
`