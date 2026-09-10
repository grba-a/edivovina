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
  title: 'Underwater Wine | Navis Mysterium — Edivo Vina',
  /* Naslov i opis su NJIHOVI, s edivovina.hr. Njihov meta description je
     fragment („is the result of…"), pa je dopunjen u recenicu njihovim
     vlastitim rijecima iz hera — nista dodano. */
  description:
    'Navis Mysterium is the result of intelligent effort with the touch of tradition. The unique essence of the Adriatic sea.',
  openGraph: {
    title: 'Underwater Wine | Navis Mysterium — Edivo Vina',
    description: 'The unique essence of the Adriatic sea. We store it in the depths for more than 700 days.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Cijeli web je na engleskom — i to nije nasa odluka nego njihova: na
         edivovina.hr engleski JE root locale, hrvatski stoji na /hr/. Prije je
         ovdje bio lang="hr" jer je stranica bila hrvatska; s pogresnim jezikom
         citac ekrana izgovara tekst tudom fonetikom. WCAG 3.1.1, razina A. */
    <html lang="en" className={`${baskerville.variable} ${raleway.variable}`}>
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
          Skip to content
        </a>
        <ScrollProvider />
        <Water />
        {children}
      </body>
    </html>
  )
}
