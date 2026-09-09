import Bottle from '@/components/bottle'
import Depth from '@/components/Depth'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Dive from '@/components/Dive'
import Winery from '@/components/Winery'
import Shop from '@/components/Shop'
import Press from '@/components/Press'
import Awards from '@/components/Awards'
import Footer from '@/components/Footer'
import { MAX_M } from '@/data/stations'

/**
 * NASLOVNICA — zaron od povrsine do 25 metara.
 *
 * Sest postaja, i svaka sama deklarira sto amfora na njoj radi
 * (src/data/stations.ts). Redoslijed je Petrov:
 *
 *    0 m  povrsina    fotografija iznad vode, amfora ISPRED naslova
 *    3 m  uranjanje   predmet je subjekt: pada kroz sredinu praznog kadra
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
      {/* Naslovnica je JEDINA stranica koja vozi cijeli zaron. Deklarira ga
          eksplicitno, kao i svaka podstranica svoju dubinu — implicitni default
          u descent.ts je znacio da se naslovnica ponasa drukcije od svih
          ostalih, a to je razlika koju netko kasnije ne bi ocekivao. */}
      <Depth m={0} drift={MAX_M} />
      <Bottle />
      <Header />
      <main className="relative z-10 flex min-h-svh flex-col">
        <Hero />
        <Dive />
        <Winery />
        <Shop />
        <Press />
        <Awards />
        <Footer />
      </main>
    </>
  )
}
