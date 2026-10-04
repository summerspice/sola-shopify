import { useState } from 'react';

type Variant = {
    id: number;
    title: string;
    available: boolean;
}

type Props = {
    selectedId: number;
    variants: Variant[];
}

export default function SizeSelector({ selectedId, variants }: Props) {
    const [currentId, setCurrentId] = useState(selectedId)

    if (variants.length < 2) return null

    function choose(id: number) {
        setCurrentId(id)

        const field = document.querySelector<HTMLSelectElement | HTMLInputElement>(
            'form[action*="/cart/add"] [name="id"]',
        )
        if (field) field.value = String(id)
    }


    return (
        <div>
            <p>Size</p>
            <div style={{ display: 'flex', gap: 8 }}>
                {variants.map((v) => {
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