import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { PersistedQueryLink } from '@apollo/client/link/persisted-queries'

async function sha256(text: string): Promise<string> {
    const bytes = new TextEncoder().encode(text)
    const hash = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_SOLA_API_URL,
    useGETForQueries: true,
})

const persistedLink = new PersistedQueryLink({ sha256 })

export const apolloClient = new ApolloClient({
    link: persistedLink.concat(httpLink),
    cache: new InMemoryCache(),
})