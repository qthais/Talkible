import { gql } from "@apollo/client";

export const CREATE_CHATROOM=gql`
    mutation createChatroom($name:String!){
        createChatroom(name:$name){
            name
            id
        }
    }
`