import { gql } from "@apollo/client";


export const SEND_MESSAGE= gql`
    mutation SendMessage($chatroomId:Float!,$content:String!,$image:Upload,$systemMessage: Boolean){
        sendMessage(chatroomId:$chatroomId,content:$content,image:$image,systemMessage: $systemMessage){
            id
            content
            imageUrl
            systemMessage
            user{
                id
                fullname
                email
            }
        }
    }
` 