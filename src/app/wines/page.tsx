import type { Metadata } from 'next'
import Link from 'next/link'
import PageHead from '@/components/PageHead'
import Footer from '@/components/Footer'
import Frame from '@/components/ui/Frame'
import Reveal from '@/components/ui/Reveal'
import { undersea, cellar, type Wine } from '@/data/wines'

export const metadata: Metadata = {
  title: 'Wines — Edivo Vina',
  description:
    'Plavac Mali and Pošip aged on the Adriatic seabed, and the cellar wines they are measured against.',
}

const price = (n: number) => '€' + (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

function Card({ w }: { w: Wine }) {
  return (
    <li>
      <Link href={`/wines/${w.slug}`} className="group block">
        <Reveal from={0.18}>
          <Frame
            name={w.image}
            alt={w.name}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="aspect-[4/5] w-full bg-navy/30 object-cover transition-opacity duration-300 group-hover:opacity-85"
          />
        </Reveal>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl leading-tight text-ivory">{w.name}</h3>
            <p className="data-label mt-2 text-gold/70" style={{ fontSize: '0.5rem' }}>
              {w.grapes.join(' · ')}
            </p>
          </div>
          <p className="font-sans tnum shrink-0 text-ivory/80">{price(w.price)}</p>
        </div>
        <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-ivory/50">
          {w.shortDescription}
        </p>
      </Link>
    </li>
  )
}

export default function WinesPage() {
  return (
    <>
      <main className="relative z-10">
        <PageHead
          eyebrow="The collection"
          title="Ten wines. Four of them have been underwater."
          intro="Everything here is made from Croatian fruit on the Pelješac peninsula. The prices are not a
          scale of quality — they are a scale of how much the sea was involved."
        />

        <section className="px-5 pb-24 md:px-8 md:pb-32">
          <div className="mx-auto w-full max-w-[92rem]">
            <div className="flex items-baseline gap-4 border-t border-ivory/12 pt-8">
              <h2 className="font-display text-2xl text-ivory md:text-3xl">
                Aged at 25 metres
              </h2>
              <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
                700 days down
              </span>
            </div>
            <ul className="mt-10 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {undersea().map((w) => (
                <Card key={w.slug} w={w} />
              ))}
            </ul>

            <div className="mt-24 flex items-baseline gap-4 border-t border-ivory/12 pt-8">
              <h2 className="font-display text-2xl text-ivory md:text-3xl">
                Aged in Janjina
              </h2>
              <span className="data-label text-ivory/30" style={{ fontSize: '0.5rem' }}>
                the control group
              </span>
            </div>
            <ul className="mt-10 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {cellar().map((w) => (
                <Card key={w.slug} w={w} />
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
