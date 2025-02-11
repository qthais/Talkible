import { gql } from "@apollo/client";

export const UPDATE_PROFILE= gql`
    mutation updateProfile(
        $fullname:String!,
        $file:Upload,
        $chatroomId:Float
    )
    updatePrifile(fullname: $fullname, file:$file, $chatroomId:$$chatroomId){
        id
        fullname
        avatarUrl
    }
`