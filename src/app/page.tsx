import Bottle from '@/components/bottle'
import Hero from '@/components/Hero'
import Catalogue from '@/components/Catalogue'
import Typology from '@/components/Typology'
import Proof from '@/components/Proof'
import Close from '@/components/Close'
import Footer from '@/components/Footer'
import BuyBar from '@/components/BuyBar'

/**
 * Naslovnica u svijetu NALAZA.
 *
 *   hero        obecanje — netaknut, odobren
 *   Katalog     trgovina vodi (odluka klijenta); argument je u POLJIMA zapisa
 *   Tipologija  potpis: isto vino izmjereno na tri nacina — to je TRIS
 *   Dokaz       palmarès s njihovim pravim medaljama
 *   Zatvaranje  voda, ne ploca: tu amfora sjeda u leziste
 *
 * Cetiri ploce ispod hera, ne devet sekcija. Izmedu njih je voda i amfora.
 */
export default function Home() {
  return (
    <>
      <Bottle />
      <main className="relative z-10">
        <Hero />
        <Catalogue />
        <Typology />
        <Proof />
        <Close />
      </main>
      <Footer />
      <BuyBar />
    </>
  )
}
