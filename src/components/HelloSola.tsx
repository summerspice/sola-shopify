import { useState } from 'react'

type Props = {
    shopName: string
}

export default function HelloSola({ shopName }: Props) {
    const [count, setCount] = useState(0)

    return (
        <div style={{ padding: '24px', border: '1px solid #000' }}>
            <p>Hello from React 19 on {shopName}</p>
            <button type="button" onClick={() => setCount(count + 1)}>
                Clicked {count} times
            </button>
        </div>
    )
}