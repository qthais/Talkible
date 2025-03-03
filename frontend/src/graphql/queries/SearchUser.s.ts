import { gql } from "@apollo/client";

export const SEARCH_USER=gql`
    query SearchUsers($fullname:String!){
        searchUsers(fullname:$fullname){
            id
            fullname
            email
        }
    }
`