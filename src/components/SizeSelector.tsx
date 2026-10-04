import { useEffect, useState } from 'react';
import { gql, type TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';


type Variant = {
    id: number;
    title: string;
    available: boolean;
}

type Props = {
    handle: string;
    selectedId: number;
    variants: Variant[];
}

type Data = { product: { id: string; variants: { id: string; availableForSale: boolean }[] } | null }
type Vars = { handle: string }

const GET_LIVE_STOCK: TypedDocumentNode<Data, Vars> = gql`
  query GetLiveStock($handle: String!) {
    product(handle: $handle) {
      id
      variants { id availableForSale }
    }
  }
`

export default function SizeSelector({ handle, selectedId, variants }: Props) {
    const [currentId, setCurrentId] = useState(selectedId)
    const { data } = useQuery(GET_LIVE_STOCK, { variables: { handle } })

    const live = new Map(data?.product?.variants.map((v) => [v.id, v.availableForSale]))
    const sizes = variants.map((v) => ({ ...v, available: live.get(String(v.id)) ?? v.available }))

    function choose(id: number) {
        setCurrentId(id)
        const field = document.querySelector<HTMLSelectElement | HTMLInputElement>(
            'form[action*="/cart/add"] [name="id"]',
        )
        if (field) field.value = String(id)
    }

    useEffect(() => {
        const current = sizes.find((s) => s.id === currentId)
        if (current && !current.available) {
            const next = sizes.find((s) => s.available)
            if (next) choose(next.id)
        }
    }, [data])

    if (variants.length < 2) return null


    return (
        <div>
            <p>Size</p>
            <div style={{ display: 'flex', gap: 8 }}>
                {sizes.map((v) => {
                    const selected = v.id === currentId
                    return (
                        <button
                            key={v.id}
                            type="button"
                            onClick={() => choose(v.id)}
                            disabled={!v.available}
                            aria-pressed={selected}
                            style={{
                                minWidth: 44,
                                padding: '8px 12px',
                                border: selected ? '2px solid #000' : '1px solid #ccc',
                                background: '#fff',
                                opacity: v.available ? 1 : 0.4,
                                textDecoration: v.available ? 'none' : 'line-through',
                                cursor: v.available ? 'pointer' : 'not-allowed',
                                fontWeight: selected ? 'bold' : 'normal'
                            }}
                        >
                            {v.title}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}