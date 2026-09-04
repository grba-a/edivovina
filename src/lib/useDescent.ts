'use client'

import { useEffect, useRef, useState } from 'react'
import { getDescent, type DescentDetail } from './descent'

/**
 * Za React potrosace koji trebaju p kao stanje (dubinomjer, brojke).
 * Throttlea na `step` da tekstualni readout ne rerendera 60x/s.
 */
export function useDescent(step = 0.004) {
  const [p, setP] = useState(0)
  const last = useRef(0)

  useEffect(() => {
    const apply = (v: number) => {
      if (Math.abs(v - last.current) < step && v !== 0 && v !== 1) return
      last.current = v
      setP(v)
    }
    apply(getDescent())
    const on = (e: Event) => apply((e as CustomEvent<DescentDetail>).detail.p)
    window.addEventListener('descent', on)
    return () => window.removeEventListener('descent', on)
  }, [step])

  return p
}

/**
 * Za imperativne potrosace (WebGL) — bez rerendera, samo ref koji se azurira.
 */
export function useDescentRef() {
  const ref = useRef(0)
  useEffect(() => {
    ref.current = getDescent()
    const on = (e: Event) => { ref.current = (e as CustomEvent<DescentDetail>).detail.p }
    window.addEventListener('descent', on)
    return () => window.removeEventListener('descent', on)
  }, [])
  return ref
}
