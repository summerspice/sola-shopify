import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react';


// 1. The query we send to SOLA-api (our own schema, not Shopify's)
const GET_PRODUCT = gql`
    query GetProductCard($handle: String!){
        product(handle: $handle) {
            id
            title
            imageUrl
            availableForSale
            price { 
                amount
                currencyCode
            }
        }
    }
`

type ProductCardData = {
    product: {
        id: string
        title: string
        imageUrl: string | null
        availableForSale: boolean
        price: {
            amount: number
            currencyCode: string
        }
    } | null
}

type ProductCardVars = { handle: string }

type Props = { handle: string }

export default function ProductCard({ handle }: Props) {
    // Run the query
    const { data, loading, error } = useQuery<ProductCardData, ProductCardVars>(GET_PRODUCT, {
        variables: { handle }
    })

    if (loading) return <p>Loading...</p>
    if (error) return <p>Could not load product: {error.message}</p>
    if (!data?.product) return <p>Product "{handle}" not found.</p>

    const p = data.product
    const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: p.price?.currencyCode,
    }).format(p.price?.amount ?? 0)




    return (
        <div style={{ maxWidth: '320px', border: '1px solid #000', padding: '16px' }}>
            {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: '100%' }} />}
            <h3>{p.title}</h3>
            <p>{price}</p>
            <p>{p.availableForSale ? 'In stock' : 'Out of stock'}</p>
        </div>
    )
}