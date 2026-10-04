import { gql, type TypedDocumentNode } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

type Vars = { handle: string }

type Props = { handle: string }

type ColorGroup = 'Core' | 'Limited'

type Sibling = {
    id: string
    handle: string
    colorName: string | null
    swatch: string | null
    colorGroup: ColorGroup | null
    availableForSale: boolean
}

type Data = {
    product: { id: string; handle: string; colorSiblings: Sibling[] } | null
}


const GROUPS: ColorGroup[] = ['Core', 'Limited']

const GET_COLOR_SWATCHES: TypedDocumentNode<Data, Vars> = gql`
  query GetPdpSwatchProducts($handle: String!) {
     product(handle: $handle) {
      id
      handle
      colorSiblings {
        id
        handle
        colorName
        swatch
        colorGroup
        availableForSale
      }
    }
}
`

export default function ColorSwatches({ handle }: Props) {
    const { data, loading, error } = useQuery(GET_COLOR_SWATCHES, {
        variables: { handle },
    })

    // Liquid already shows "Core: Black", so we show nothing while loading or on error
    if (loading || error || !data?.product) return null

    const siblings = data.product.colorSiblings
    if (siblings.length < 2) return null // only one color: no swatches needed

    return (
        <div>
            {GROUPS.map((group) => {
                const items = siblings.filter((s) => s.colorGroup === group)
                if (items.length === 0) return null

                return (
                    <div key={group} style={{ marginBottom: '12px' }}>
                        <p style={{ margin: '0 0 6px' }}>
                            {group} · {items.length} {items.length === 1 ? 'Color' : 'Colors'}
                        </p>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            {items.map((s) => {
                                const isCurrent = s.handle === handle
                                return (
                                    <a
                                        key={s.id}
                                        href={`/products/${s.handle}`}
                                        title={s.colorName ?? s.handle}
                                        aria-label={s.colorName ?? s.handle}
                                        aria-current={isCurrent ? 'true' : undefined}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: s.swatch ?? '#ccc',
                                            outline: isCurrent ? '2px solid #000' : '1px solid #ddd',
                                            outlineOffset: '2px',
                                            opacity: s.availableForSale ? 1 : 0.4,
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}