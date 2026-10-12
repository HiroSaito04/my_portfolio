import {
  useEffect,
  useRef,
} from 'react'

export function useRevealOnScroll() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current

    if (!root) {
      return undefined
    }

    const nodes =
      root.querySelectorAll(
        '[data-reveal]',
      )

    if (!nodes.length) {
      return undefined
    }

    if (
      !('IntersectionObserver' in window)
    ) {
      nodes.forEach((node) =>
        node.classList.add(
          'is-visible',
        ),
      )

      return undefined
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  'is-visible',
                )

                observer.unobserve(
                  entry.target,
                )
              }
            },
          )
        },
        {
          threshold: 0.12,
          rootMargin:
            '0px 0px -60px',
        },
      )

    nodes.forEach((node) =>
      observer.observe(node),
    )

    return () =>
      observer.disconnect()
  }, [])

  return ref
}