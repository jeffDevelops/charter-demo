import { useEffect, RefObject } from 'react'

export const useScrollToEffect = (
  ref: Partial<RefObject<HTMLElement>>,
  deps: unknown[],
) => {
  useEffect(() => {
    if (
      ref.current &&
      typeof ref.current.scrollTo !== 'undefined'
    )
      ref.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
  }, deps)
}
