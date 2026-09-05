import Bottle from '@/components/bottle'
import Header from '@/components/Header'
import DepthRail from '@/components/DepthRail'
import Hero from '@/components/Hero'
import Winery from '@/components/Winery'
import Shop from '@/components/Shop'
import Press from '@/components/Press'
import Awards from '@/components/Awards'
import Footer from '@/components/Footer'

/**
 * NASLOVNICA — zaron od povrsine do 25 metara.
 *
 * Sest postaja, i svaka sama deklarira sto amfora na njoj radi
 * (src/data/stations.ts). Redoslijed je Petrov:
 *
 *    0 m  povrsina    fotografija iznad vode, amfora ISPRED naslova
 *    6 m  vinarija    cista tipografija, amfore nema
 *   12 m  boce        tri featured, amfora smanjena i tone pokraj
 *   18 m  pisali su   dokaz, amfore nema
 *   22 m  nagrade     amfora se vraca, mala
 *   25 m  dno         footer; amfora sjeda u leziste
 *
 * Visina stranice JE trajanje spusta: `--descent` je scroll-progress, pa
 * dodavanje ili skracivanje sekcija pretimira cijelu animaciju. Ako se to
 * dogodi, provjeri da amfora sjeda u kavez unutar footera (kavez izlazi na
 * p 0,78–0,99), a ne prije ili poslije.
 */
export default function Home() {
  return (
    <>
      <Bottle />
      <Header />
      <DepthRail />
      <main className="relative z-10 flex min-h-svh flex-col">
        <Hero />
        <Winery />
        <Shop />
        <Press />
        <Awards />
        <Footer />
      </main>
    </>
  )
}
