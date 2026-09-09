'use client'

import { useEffect } from 'react'
import { setRange } from '@/lib/descent'
import { syncStage } from '@/lib/stage'
import { MAX_M } from '@/data/stations'

/** Koliko metara stranica "plovi" dok je citas. Voda dise, koordinata ostaje tvoja. */
export const DRIFT_M = 2

/**
 * DUBINA STRANICE. Renderira null; postoji samo da javi spustu gdje smo.
 *
 * Naslovnica je cijeli zaron i NE renderira ovo — `descent.ts` po defaultu stoji
 * na base 0 / span 1. Svaka podstranica deklarira svoju dubinu i time dobiva boju
 * vode koja joj pripada.
 *
 * MORA biti u `children`, ne u layoutu. `ScrollProvider` je u layoutu i njegov
 * `useEffect(…, [])` se ne vrti na client-side navigaciji, pa bi `--descent` ostao
 * ustajao pri prelasku s `/` na `/wines`. Stara verzija je to rjesavala kroz
 * `usePathname` u ScrollProvideru, ali je time rusila i ponovno stvarala Lenis
 * instancu na svakoj navigaciji.
 *
 * Cleanup vraca na cijeli zaron jer je to naslovnica: React prvo odradi sve
 * cleanupove pa onda sve efekte, tako da podstranica -> podstranica prolazi kroz
 * (0,1) i odmah sjeda na novu dubinu bez vidljivog skoka (jedan rAF).
 */
export default function Depth({ m, drift = DRIFT_M }: { m: number; drift?: number }) {
  /* Ispod dna nema nista: postaja na 25 m ne moze plutati na 27. Bez ovoga se
     `--descent` samo clampa na 1, pa bi kontakt stranica cijelim skrolom
     stajala na istoj boji a mjerenje bi tvrdilo da raspon ne radi. */
  const span = Math.max(0, Math.min(drift, MAX_M - m)) / MAX_M

  useEffect(() => {
    setRange(m / MAX_M, span)
    /* Pozornica se mora presloziti i kad se nije skrolalo — route change ne
       emitira scroll event, pa bi vidljivost amfore ostala ustajala. */
    syncStage()
    return () => setRange(0, 1)
  }, [m, span])

  return null
}
