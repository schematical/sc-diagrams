import {
    ApolloClient, ApolloLink, HttpLink,
    InMemoryCache
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { isExpired, decodeToken } from "react-jwt";

const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('accessToken');
    // console.log("Apollo 1 - token", token);
    if (!token) {
        // console.log("Apollo 2 - headers", headers);
        return {
            ...headers
        }
    }
    // return the headers to the context so httpLink can read them

    const request = {
        headers: {
            ...headers,
            authorization: token ? `${token}` : "",
        }
    };
    // console.log("Apollo 3 - headers", request);
    return request;
});
const graphQLUri = process.env.NEXT_PUBLIC_GRAPHQL_URI || 'https://dev-v1-us-east-1-api.schematical.com/chaoscrawler'
const client = new ApolloClient({
    uri: graphQLUri,
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
        }
    },
    link: ApolloLink.from([authLink, new HttpLink({uri: graphQLUri})])
});
export default client;