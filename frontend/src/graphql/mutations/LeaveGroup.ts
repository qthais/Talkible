import { gql } from "@apollo/client";

export const LEAVE_GROUP=gql`
    mutation leaveGroup($chatroomId:Float!){
        leaveGroup(chatroomId:$chatroomId)
    }
`