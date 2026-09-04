import Bottle from '@/components/bottle'
import Hero from '@/components/Hero'
import Reveal2 from '@/components/Reveal2'
import TheThree from '@/components/TheThree'
import Bottles from '@/components/Bottles'
import Proof from '@/components/Proof'
import Close from '@/components/Close'
import Footer from '@/components/Footer'
import BuyBar from '@/components/BuyBar'

/**
 * Sest udaraca, svaki nosi jedan prodajni posao:
 *   01 Hero      — zelja
 *   02 Reveal    — bez daha, bez CTA-a
 *   03 The Three — objasni I zatvori u istom kadru
 *   04 Bottles   — ulaz po jednoj boci
 *   05 Proof     — medalje i mediji u jednoj traci
 *   06 Close     — dvije odluke i nista drugo
 */
export default function Home() {
  return (
    <>
      <Bottle />
      <main className="relative z-10">
        <Hero />
        <Reveal2 />
        <TheThree />
        <Bottles />
        <Proof />
        <Close />
      </main>
      <Footer />
      <BuyBar />
    </>
  )
}
