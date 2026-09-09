import Depth from '@/components/Depth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Station as Data } from '@/data/stations'

/**
 * Okvir svake podstranice. Cetiri stvari koje se ne smiju zaboraviti nijednom:
 *
 *   <Depth>   deklarira dubinu stranice; bez njega spust ide 0 -> 25 m i
 *             kontakt stranica te odvede na dno u dva flika misa
 *   <Header>  nije u layoutu, nego u page.tsx (naslovnica isto tako)
 *   <Footer seabed={false}>  isti sadrzaj kao na naslovnici, bez koordinate,
 *             CTA-a i seabed tretmana — leziste je nagrada zarona
 *   min-h-svh + flex-col  da `mt-auto` u footeru drzi kratke stranice dolje
 *
 * 3D amfora se NE mount-a: <Bottle /> ostaje samo na naslovnici.
 */
export default function PageShell({
  data,
  children,
}: {
  data: Data
  children: React.ReactNode
}) {
  return (
    <>
      <Depth m={data.m} />
      <Header />
      <main className="relative z-10 flex min-h-svh flex-col">
        {children}
        <Footer seabed={false} />
      </main>
    </>
  )
}
