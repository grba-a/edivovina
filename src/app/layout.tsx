import type { Metadata } from 'next'
import { Libre_Baskerville, Raleway } from 'next/font/google'
import ScrollProvider from '@/components/ScrollProvider'
import Chrome from '@/components/Chrome'
import './globals.css'

/* Iz Edivo brand guidelinesa: Libre Baskerville za bold i italic,
   Raleway za regular tekst. Samo dva fonta — trece bi bilo moje, ne njihovo. */
/* Samo tezine koje se STVARNO koriste: Baskerville 400 + italic (naslovi i
   akcenti), Raleway 400 + 500 (tekst i data-label). Guideline navodi i bold,
   ali ga nista na stranici ne trazi — 8 datoteka za 4 koje trebam bilo je
   201 KB fontova na mobitelu. */
const baskerville = Libre_Baskerville({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
})
const raleway = Raleway({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-raleway',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Edivo Vina — Two years underwater',
  description:
    'Plavac Mali sealed in clay and left in a sunken ship off Pelješac for 700 days. The first underwater winery in the world.',
  openGraph: {
    title: 'Edivo Vina — Two years underwater',
    description: 'Plavac Mali, sealed in clay and aged on the seabed off Pelješac, Croatia.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baskerville.variable} ${raleway.variable}`}>
      <head>
        {/* Bez JS-a sve mora biti vidljivo. Klasu na <html> NE dodavati skriptom
            — to razbije hydration. */}
        <noscript>
          <style>{`.ed-line{transform:none!important;animation:none!important}.ed-fade{opacity:1!important;transform:none!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <div
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: Every wine here is a catalogued artefact raised from a depth, not a product in a
grid. Refuses the category arrangement: big hero bottle shot, gold serif, "Our Story".

OWN-WORLD: Light museum plates (#F2EFE6, ink #071A24) floating over the dark water column;
a plate never spans edge to edge, so the falling amphora passes between and behind them.
Gold (Pantone 7509C) is a stamp and an action only, never a frame. Libre Baskerville titles
the plate; Raleway with tabular figures is the record's field type.

STORY: The buyer is choosing an object for a gift or a moment. They read a find record,
see the depth and the duration in its fields, and act from inside the record itself.

FIRST VIEWPORT: Unchanged, approved. Dark water, 3D amphora descending, headline bottom
left, two buttons in a row, price line. The plates begin below it.

FORM: Finds catalogue. Candidate 2 of the grounded list; user-pinned over the roll
(a pinned direction beats the roll). Seed key 57859abb.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
the verdict, and DESIGN.md
-->`,
          }}
        />
        <ScrollProvider />
        <Chrome />
        {children}
      </body>
    </html>
  )
}
