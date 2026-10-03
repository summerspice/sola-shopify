import { lazy, Suspense, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'

// 1. Island list: name used in Liquid → component file
const islands: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
    'hello-sola': () => import('@/components/HelloSola'),
}

// 2. Find every <div data-island="..."> and mount React into it
function mountIslands() {
    document.querySelectorAll<HTMLElement>('[data-island]').forEach((el) => {
        const name = el.dataset.island ?? ''
        const loader = islands[name]
        if (!loader) {
            console.warn(`SOLA: unknown island "${name}"`)
            return
        }

        // 3. Read props from <script type="application/json"> inside the div
        const json = el.querySelector('script[type="application/json"]')
        const props = json ? JSON.parse(json.textContent || '{}') : {}

        const Component = lazy(loader)
        createRoot(el).render(
            <Suspense fallback={null}>
                <Component {...props} />
            </Suspense>,
        )
    })
}

mountIslands()