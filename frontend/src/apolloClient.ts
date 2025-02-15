import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  Observable,
  ApolloLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
// import { WebSocketLink } from "@apollo/client/link/ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { useUserStore } from "./stores/userStore";
import { onError } from "@apollo/client/link/error";
loadErrorMessages();
loadDevMessages();
async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }
      `,
    });
    const newAccessToken = data?.refreshToken;
    if (!newAccessToken) {
      throw new Error("New access token not received");
    }
    return `Bearer ${newAccessToken}`;
  } catch (err) {
    throw new Error(err.message);
  }
}
let retryCount = 0;
const maxRetry = 3;
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3000/graphql",
    connectionParams:()=> ({
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }),
    onNonLazyError: (error) => {
      console.error("GraphQL WebSocket Error:", error);
    },
  })
);
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  for (const err of graphQLErrors) {
    if (err.extensions.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
      retryCount++;
      return new Observable((observer) => {
        refreshToken(client)
          .then((token) => {
            console.log("token", token);
            operation.setContext((previousContext) => ({
              headers: [...previousContext.headers, { authorization: token }],
            }));
            const forward$ = forward(operation);
            forward$.subscribe(observer);
            //observer is the listener, listening every errors from the forward$
          })
          .catch((error) => observer.error(error));
      });
    }
    if (err.message === "Refresh token not found") {
      console.log("refresh token not found");
      useUserStore.setState({
        id: undefined,
        fullname: "",
        email: "",
      });
    }
  }
});

const uploadLink = createUploadLink({
  uri: "http://localhost:3000/graphql",
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  ApolloLink.from([errorLink, uploadLink])
);
export const client = new ApolloClient({
  cache: new InMemoryCache({}),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  link: link,
});
