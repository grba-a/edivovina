import Bottle from '@/components/bottle'
import DepthGauge from '@/components/ui/DepthGauge'

/**
 * NASLOVNICA — cista podloga.
 *
 * Ostala je samo atmosfera: vodeni stupac (Water u layoutu), 3D amfora koja
 * pada u leziste na dnu, dubinomjer i morsko dno. Sav dizajn iznad toga je
 * skinut i ceka novi smjer.
 *
 * Visina stranice NIJE ukras. Spust je normalizirani scroll-progress
 * (src/lib/descent.ts): bez visine je scrollHeight jednak visini prozora, p
 * ostaje 0 i amfora nikad ne krene. Ovih sedam ekrana je duljina spusta i
 * zamijenit ce ih sekcije kad dodu.
 */
const SCREENS = 7

export default function Home() {
  return (
    <>
      <Bottle />
      <DepthGauge />
      <main className="relative z-10" style={{ minHeight: `${SCREENS * 100}svh` }} />
    </>
  )
}
