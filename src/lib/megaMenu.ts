const OPEN_DELAY = 100
const CLODE_DELAY = 200

function setOpen(item: HTMLElement, open: boolean) {
    item.classList.toggle('is-open', open)
    item.querySelector('.menu__link')?.setAttribute('aria-expanded', String(open))
}

export function initMegaMenu() {
    const nav = document.querySelector<HTMLElement>('.header__menu')
    if (!nav) return

    nav.classList.add('js-mega')
    const items = nav.querySelectorAll<HTMLElement>('.menu__item--has-panel')

    items.forEach((item) => {
        let timer: number | undefined
        setOpen(item, false) // start closed: aria-expanded="false"

        item.addEventListener('mouseenter', () => {
            clearTimeout(timer)
            timer = window.setTimeout(() => {
                items.forEach((other) => other !== item && setOpen(other, false)) // only one panel open
                setOpen(item, true)
            }, OPEN_DELAY)
        })

        item.addEventListener('mouseleave', () => {
            clearTimeout(timer)
            timer = window.setTimeout(() => {
                setOpen(item, false)
            }, CLODE_DELAY)
        })
    })
}