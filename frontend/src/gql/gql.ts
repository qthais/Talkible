/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    mutation addUsersToChatroom($chatroomId:Float!, $userIds:[Float!]!){\n        addUsersToChatroom(chatroomId:$chatroomId,userIds:$userIds){\n            name\n            id\n        }\n    }\n": typeof types.AddUsersToChatroomDocument,
    "\n    mutation EnterChatroom($chatroomId: Float!){\n        enterChatroom(chatroomId:$chatroomId)\n    }\n": typeof types.EnterChatroomDocument,
    "\n    mutation LeaveChatroom($chatroomId:Float!){\n        leaveChatroom(chatroomId:$chatroomId)\n    }\n": typeof types.LeaveChatroomDocument,
    "\n    mutation leaveGroup($chatroomId:Float!){\n        leaveGroup(chatroomId:$chatroomId)\n    }\n": typeof types.LeaveGroupDocument,
    "\n    mutation LoginUser($email: String!, $password: String!){\n        login(loginInput:{email: $email, password:$password}){\n            user{\n                email\n                id\n                fullname\n                avatarUrl\n            }\n        }\n    }\n": typeof types.LoginUserDocument,
    "\n    mutation LogoutUser{\n        logout\n    }\n": typeof types.LogoutUserDocument,
    "\n    mutation RegisterUser(\n        $fullname: String!,\n        $email: String!,\n        $password: String!,\n        $confirmPassword:String!,\n    ){\n        register(\n            registerInput: {\n                fullname: $fullname,\n                email: $email,\n                password: $password,\n                confirmPassword: $confirmPassword,\n            }\n        ){\n            user{\n                id\n                fullname\n                email\n            }\n        }\n    }\n": typeof types.RegisterUserDocument,
    "\n  mutation userStartedTypingMutation($chatroomId: Float!) {\n    userStartedTypingMutation(chatroomId: $chatroomId) {\n      id\n      fullname\n      email\n    }\n  }\n": typeof types.UserStartedTypingMutationDocument,
    "\n  mutation userStoppedTypingMutation($chatroomId: Float!) {\n    userStoppedTypingMutation(chatroomId: $chatroomId) {\n      id\n      fullname\n      email\n    }\n  }\n": typeof types.UserStoppedTypingMutationDocument,
    "\n    mutation createChatroom($name:String!){\n        createChatroom(name:$name){\n            name\n            id\n        }\n    }\n": typeof types.CreateChatroomDocument,
    "\n    mutation deleteChatroom($chatroomId:Float!){\n        deleteChatroom(chatroomId:$chatroomId)\n    }\n": typeof types.DeleteChatroomDocument,
    "\n    mutation SendMessage($chatroomId:Float!,$content:String!,$image:Upload){\n        sendMessage(chatroomId:$chatroomId,content:$content,image:$image){\n            id\n            content\n            imageUrl\n            user{\n                id\n                fullname\n                email\n            }\n        }\n    }\n": typeof types.SendMessageDocument,
    "\n  mutation updateProfile(\n    $fullname: String!\n    $file: Upload\n  ) {\n    updateProfile(fullname: $fullname, file: $file) {\n      id\n      fullname\n      avatarUrl\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n    query GetUserOfChatroom($chatroomId:Float!){\n        getUsersOfChatroom(chatroomId:$chatroomId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n": typeof types.GetUserOfChatroomDocument,
    "\n    query SearchUsers($fullname:String!){\n        searchUsers(fullname:$fullname){\n            id\n            fullname\n            email\n        }\n    }\n": typeof types.SearchUsersDocument,
    "\n query getChatroomsForUser($userId:Float!){\n    getChatroomsForUser(userId:$userId){\n        id\n        name\n        messages{\n            id\n            content\n            createdAt\n            user{\n                id\n                fullname\n            }\n        }\n        users{\n            avatarUrl\n            id\n            fullname\n            email\n        }\n    }\n\n }\n": typeof types.GetChatroomsForUserDocument,
    "\n    query getMessagesForChatroom($chatroomId:Float!){\n        getMessagesForChatroom(chatroomId:$chatroomId){\n            id\n            content\n            imageUrl\n            createdAt\n            user{\n                id\n                fullname\n                email\n                avatarUrl\n            }\n            chatroom{\n                id\n                name\n                users{\n                    id\n                    fullname\n                    email\n                    avatarUrl\n                }\n            }\n        }\n    }\n": typeof types.GetMessagesForChatroomDocument,
    "\n    subscription liveUsersInChatRoom($chatroomId:Float!){\n        liveUsersInChatroom(chatroomId:$chatroomId){\n            id\n            fullname\n            avatarUrl\n            email\n        }\n    }\n": typeof types.LiveUsersInChatRoomDocument,
    "\n  subscription NewMessage($chatroomId: Float!) {\n    newMessage(chatroomId: $chatroomId) {\n      id\n      content\n      imageUrl\n      createdAt\n      user {\n        id\n        fullname\n        email\n        avatarUrl\n      }\n    }\n  }\n": typeof types.NewMessageDocument,
    "\n    subscription userStartedTyping($chatroomId:Float!,$userId:Float!){\n        userStartedTyping(chatroomId:$chatroomId,userId:$userId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n": typeof types.UserStartedTypingDocument,
    "\n    subscription userStoppedTyping($chatroomId:Float!,$userId:Float!){\n        userStoppedTyping(chatroomId:$chatroomId,userId:$userId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n": typeof types.UserStoppedTypingDocument,
};
const documents: Documents = {
    "\n    mutation addUsersToChatroom($chatroomId:Float!, $userIds:[Float!]!){\n        addUsersToChatroom(chatroomId:$chatroomId,userIds:$userIds){\n            name\n            id\n        }\n    }\n": types.AddUsersToChatroomDocument,
    "\n    mutation EnterChatroom($chatroomId: Float!){\n        enterChatroom(chatroomId:$chatroomId)\n    }\n": types.EnterChatroomDocument,
    "\n    mutation LeaveChatroom($chatroomId:Float!){\n        leaveChatroom(chatroomId:$chatroomId)\n    }\n": types.LeaveChatroomDocument,
    "\n    mutation leaveGroup($chatroomId:Float!){\n        leaveGroup(chatroomId:$chatroomId)\n    }\n": types.LeaveGroupDocument,
    "\n    mutation LoginUser($email: String!, $password: String!){\n        login(loginInput:{email: $email, password:$password}){\n            user{\n                email\n                id\n                fullname\n                avatarUrl\n            }\n        }\n    }\n": types.LoginUserDocument,
    "\n    mutation LogoutUser{\n        logout\n    }\n": types.LogoutUserDocument,
    "\n    mutation RegisterUser(\n        $fullname: String!,\n        $email: String!,\n        $password: String!,\n        $confirmPassword:String!,\n    ){\n        register(\n            registerInput: {\n                fullname: $fullname,\n                email: $email,\n                password: $password,\n                confirmPassword: $confirmPassword,\n            }\n        ){\n            user{\n                id\n                fullname\n                email\n            }\n        }\n    }\n": types.RegisterUserDocument,
    "\n  mutation userStartedTypingMutation($chatroomId: Float!) {\n    userStartedTypingMutation(chatroomId: $chatroomId) {\n      id\n      fullname\n      email\n    }\n  }\n": types.UserStartedTypingMutationDocument,
    "\n  mutation userStoppedTypingMutation($chatroomId: Float!) {\n    userStoppedTypingMutation(chatroomId: $chatroomId) {\n      id\n      fullname\n      email\n    }\n  }\n": types.UserStoppedTypingMutationDocument,
    "\n    mutation createChatroom($name:String!){\n        createChatroom(name:$name){\n            name\n            id\n        }\n    }\n": types.CreateChatroomDocument,
    "\n    mutation deleteChatroom($chatroomId:Float!){\n        deleteChatroom(chatroomId:$chatroomId)\n    }\n": types.DeleteChatroomDocument,
    "\n    mutation SendMessage($chatroomId:Float!,$content:String!,$image:Upload){\n        sendMessage(chatroomId:$chatroomId,content:$content,image:$image){\n            id\n            content\n            imageUrl\n            user{\n                id\n                fullname\n                email\n            }\n        }\n    }\n": types.SendMessageDocument,
    "\n  mutation updateProfile(\n    $fullname: String!\n    $file: Upload\n  ) {\n    updateProfile(fullname: $fullname, file: $file) {\n      id\n      fullname\n      avatarUrl\n    }\n  }\n": types.UpdateProfileDocument,
    "\n    query GetUserOfChatroom($chatroomId:Float!){\n        getUsersOfChatroom(chatroomId:$chatroomId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n": types.GetUserOfChatroomDocument,
    "\n    query SearchUsers($fullname:String!){\n        searchUsers(fullname:$fullname){\n            id\n            fullname\n            email\n        }\n    }\n": types.SearchUsersDocument,
    "\n query getChatroomsForUser($userId:Float!){\n    getChatroomsForUser(userId:$userId){\n        id\n        name\n        messages{\n            id\n            content\n            createdAt\n            user{\n                id\n                fullname\n            }\n        }\n        users{\n            avatarUrl\n            id\n            fullname\n            email\n        }\n    }\n\n }\n": types.GetChatroomsForUserDocument,
    "\n    query getMessagesForChatroom($chatroomId:Float!){\n        getMessagesForChatroom(chatroomId:$chatroomId){\n            id\n            content\n            imageUrl\n            createdAt\n            user{\n                id\n                fullname\n                email\n                avatarUrl\n            }\n            chatroom{\n                id\n                name\n                users{\n                    id\n                    fullname\n                    email\n                    avatarUrl\n                }\n            }\n        }\n    }\n": types.GetMessagesForChatroomDocument,
    "\n    subscription liveUsersInChatRoom($chatroomId:Float!){\n        liveUsersInChatroom(chatroomId:$chatroomId){\n            id\n            fullname\n            avatarUrl\n            email\n        }\n    }\n": types.LiveUsersInChatRoomDocument,
    "\n  subscription NewMessage($chatroomId: Float!) {\n    newMessage(chatroomId: $chatroomId) {\n      id\n      content\n      imageUrl\n      createdAt\n      user {\n        id\n        fullname\n        email\n        avatarUrl\n      }\n    }\n  }\n": types.NewMessageDocument,
    "\n    subscription userStartedTyping($chatroomId:Float!,$userId:Float!){\n        userStartedTyping(chatroomId:$chatroomId,userId:$userId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n": types.UserStartedTypingDocument,
    "\n    subscription userStoppedTyping($chatroomId:Float!,$userId:Float!){\n        userStoppedTyping(chatroomId:$chatroomId,userId:$userId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n": types.UserStoppedTypingDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation addUsersToChatroom($chatroomId:Float!, $userIds:[Float!]!){\n        addUsersToChatroom(chatroomId:$chatroomId,userIds:$userIds){\n            name\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation addUsersToChatroom($chatroomId:Float!, $userIds:[Float!]!){\n        addUsersToChatroom(chatroomId:$chatroomId,userIds:$userIds){\n            name\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation EnterChatroom($chatroomId: Float!){\n        enterChatroom(chatroomId:$chatroomId)\n    }\n"): (typeof documents)["\n    mutation EnterChatroom($chatroomId: Float!){\n        enterChatroom(chatroomId:$chatroomId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation LeaveChatroom($chatroomId:Float!){\n        leaveChatroom(chatroomId:$chatroomId)\n    }\n"): (typeof documents)["\n    mutation LeaveChatroom($chatroomId:Float!){\n        leaveChatroom(chatroomId:$chatroomId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation leaveGroup($chatroomId:Float!){\n        leaveGroup(chatroomId:$chatroomId)\n    }\n"): (typeof documents)["\n    mutation leaveGroup($chatroomId:Float!){\n        leaveGroup(chatroomId:$chatroomId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation LoginUser($email: String!, $password: String!){\n        login(loginInput:{email: $email, password:$password}){\n            user{\n                email\n                id\n                fullname\n                avatarUrl\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation LoginUser($email: String!, $password: String!){\n        login(loginInput:{email: $email, password:$password}){\n            user{\n                email\n                id\n                fullname\n                avatarUrl\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation LogoutUser{\n        logout\n    }\n"): (typeof documents)["\n    mutation LogoutUser{\n        logout\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation RegisterUser(\n        $fullname: String!,\n        $email: String!,\n        $password: String!,\n        $confirmPassword:String!,\n    ){\n        register(\n            registerInput: {\n                fullname: $fullname,\n                email: $email,\n                password: $password,\n                confirmPassword: $confirmPassword,\n            }\n        ){\n            user{\n                id\n                fullname\n                email\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation RegisterUser(\n        $fullname: String!,\n        $email: String!,\n        $password: String!,\n        $confirmPassword:String!,\n    ){\n        register(\n            registerInput: {\n                fullname: $fullname,\n                email: $email,\n                password: $password,\n                confirmPassword: $confirmPassword,\n            }\n        ){\n            user{\n                id\n                fullname\n                email\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation userStartedTypingMutation($chatroomId: Float!) {\n    userStartedTypingMutation(chatroomId: $chatroomId) {\n      id\n      fullname\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation userStartedTypingMutation($chatroomId: Float!) {\n    userStartedTypingMutation(chatroomId: $chatroomId) {\n      id\n      fullname\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation userStoppedTypingMutation($chatroomId: Float!) {\n    userStoppedTypingMutation(chatroomId: $chatroomId) {\n      id\n      fullname\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation userStoppedTypingMutation($chatroomId: Float!) {\n    userStoppedTypingMutation(chatroomId: $chatroomId) {\n      id\n      fullname\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createChatroom($name:String!){\n        createChatroom(name:$name){\n            name\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation createChatroom($name:String!){\n        createChatroom(name:$name){\n            name\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation deleteChatroom($chatroomId:Float!){\n        deleteChatroom(chatroomId:$chatroomId)\n    }\n"): (typeof documents)["\n    mutation deleteChatroom($chatroomId:Float!){\n        deleteChatroom(chatroomId:$chatroomId)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SendMessage($chatroomId:Float!,$content:String!,$image:Upload){\n        sendMessage(chatroomId:$chatroomId,content:$content,image:$image){\n            id\n            content\n            imageUrl\n            user{\n                id\n                fullname\n                email\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation SendMessage($chatroomId:Float!,$content:String!,$image:Upload){\n        sendMessage(chatroomId:$chatroomId,content:$content,image:$image){\n            id\n            content\n            imageUrl\n            user{\n                id\n                fullname\n                email\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateProfile(\n    $fullname: String!\n    $file: Upload\n  ) {\n    updateProfile(fullname: $fullname, file: $file) {\n      id\n      fullname\n      avatarUrl\n    }\n  }\n"): (typeof documents)["\n  mutation updateProfile(\n    $fullname: String!\n    $file: Upload\n  ) {\n    updateProfile(fullname: $fullname, file: $file) {\n      id\n      fullname\n      avatarUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetUserOfChatroom($chatroomId:Float!){\n        getUsersOfChatroom(chatroomId:$chatroomId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n"): (typeof documents)["\n    query GetUserOfChatroom($chatroomId:Float!){\n        getUsersOfChatroom(chatroomId:$chatroomId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SearchUsers($fullname:String!){\n        searchUsers(fullname:$fullname){\n            id\n            fullname\n            email\n        }\n    }\n"): (typeof documents)["\n    query SearchUsers($fullname:String!){\n        searchUsers(fullname:$fullname){\n            id\n            fullname\n            email\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n query getChatroomsForUser($userId:Float!){\n    getChatroomsForUser(userId:$userId){\n        id\n        name\n        messages{\n            id\n            content\n            createdAt\n            user{\n                id\n                fullname\n            }\n        }\n        users{\n            avatarUrl\n            id\n            fullname\n            email\n        }\n    }\n\n }\n"): (typeof documents)["\n query getChatroomsForUser($userId:Float!){\n    getChatroomsForUser(userId:$userId){\n        id\n        name\n        messages{\n            id\n            content\n            createdAt\n            user{\n                id\n                fullname\n            }\n        }\n        users{\n            avatarUrl\n            id\n            fullname\n            email\n        }\n    }\n\n }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getMessagesForChatroom($chatroomId:Float!){\n        getMessagesForChatroom(chatroomId:$chatroomId){\n            id\n            content\n            imageUrl\n            createdAt\n            user{\n                id\n                fullname\n                email\n                avatarUrl\n            }\n            chatroom{\n                id\n                name\n                users{\n                    id\n                    fullname\n                    email\n                    avatarUrl\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query getMessagesForChatroom($chatroomId:Float!){\n        getMessagesForChatroom(chatroomId:$chatroomId){\n            id\n            content\n            imageUrl\n            createdAt\n            user{\n                id\n                fullname\n                email\n                avatarUrl\n            }\n            chatroom{\n                id\n                name\n                users{\n                    id\n                    fullname\n                    email\n                    avatarUrl\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription liveUsersInChatRoom($chatroomId:Float!){\n        liveUsersInChatroom(chatroomId:$chatroomId){\n            id\n            fullname\n            avatarUrl\n            email\n        }\n    }\n"): (typeof documents)["\n    subscription liveUsersInChatRoom($chatroomId:Float!){\n        liveUsersInChatroom(chatroomId:$chatroomId){\n            id\n            fullname\n            avatarUrl\n            email\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription NewMessage($chatroomId: Float!) {\n    newMessage(chatroomId: $chatroomId) {\n      id\n      content\n      imageUrl\n      createdAt\n      user {\n        id\n        fullname\n        email\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription NewMessage($chatroomId: Float!) {\n    newMessage(chatroomId: $chatroomId) {\n      id\n      content\n      imageUrl\n      createdAt\n      user {\n        id\n        fullname\n        email\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription userStartedTyping($chatroomId:Float!,$userId:Float!){\n        userStartedTyping(chatroomId:$chatroomId,userId:$userId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n"): (typeof documents)["\n    subscription userStartedTyping($chatroomId:Float!,$userId:Float!){\n        userStartedTyping(chatroomId:$chatroomId,userId:$userId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription userStoppedTyping($chatroomId:Float!,$userId:Float!){\n        userStoppedTyping(chatroomId:$chatroomId,userId:$userId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n"): (typeof documents)["\n    subscription userStoppedTyping($chatroomId:Float!,$userId:Float!){\n        userStoppedTyping(chatroomId:$chatroomId,userId:$userId){\n            id\n            fullname\n            email\n            avatarUrl\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;