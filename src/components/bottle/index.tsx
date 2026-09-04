'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const BottleCanvas = dynamic(() => import('./BottleCanvas'), { ssr: false })

/**
 * Mount TEK NAKON prvog painta. Da canvas ide u prvi render, LCP element bi
 * cekao three.js bundle — a LCP mora biti hero naslov iz cistog HTML-a.
 */
export default function Bottle() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number })
      .requestIdleCallback
    if (idle) {
      const id = idle(() => setReady(true), { timeout: 1200 })
      return () => (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(id)
    }
    const t = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(t)
  }, [])

  if (!ready) return null
  return <BottleCanvas />
}
