import type { Metadata } from 'next'
import { Libre_Baskerville, Raleway } from 'next/font/google'
import ScrollProvider from '@/components/ScrollProvider'
import Water from '@/components/Water'
import './globals.css'

/* Iz Edivo brand guidelinesa: Libre Baskerville za bold i italic,
   Raleway za regular tekst. Samo dva fonta — trece bi bilo moje, ne njihovo.

   Ucitavaju se samo tezine koje se STVARNO koriste: Baskerville 400 + italic,
   Raleway 400 + 500. Guideline navodi i bold, ali 8 datoteka za 4 koje trebam
   bilo je 201 KB fontova na mobitelu. */
const baskerville = Libre_Baskerville({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  /* Bez italica: grep kroz cijeli src ne nalazi ni jednu upotrebu (tri
     pojave „italic" su `not-italic` na <address>, sto gasi default a ne
     trazi font). Dvije datoteke od sest, ~40 KB od 154 KB fontova. */
  style: ['normal'],
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
    /* Stranica je na hrvatskom. S lang="en" citac ekrana izgovara „Spustili smo
         vino na dno" engleskom fonetikom i to je nerazumljivo. WCAG 3.1.1, razina A. */
    <html lang="hr" className={`${baskerville.variable} ${raleway.variable}`}>
      <head>
        {/* Bez JS-a sve mora biti vidljivo. Klasu na <html> NE dodavati skriptom
            — to razbije hydration. */}
        <noscript>
          <style>{`.ed-line{transform:none!important;animation:none!important}.ed-fade{opacity:1!important;transform:none!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {/* Sest tab stopova u headeru prije sadrzaja. Link je vidljiv tek na
            fokus — ne zauzima prostor, a korisniku tipkovnice daje izlaz. */}
        <a href="#surface" className="ed-skip">
          Na sadržaj
        </a>
        <ScrollProvider />
        <Water />
        {children}
      </body>
    </html>
  )
}
