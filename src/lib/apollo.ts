import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: import.meta.env.VITE_SOLA_API_URL,
        useGETForQueries: true,
    }),
    cache: new InMemoryCache(),
})