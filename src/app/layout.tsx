import type { Metadata } from 'next'
import { Libre_Baskerville, Raleway } from 'next/font/google'
import ScrollProvider from '@/components/ScrollProvider'
import Chrome from '@/components/Chrome'
import './globals.css'

/* Iz Edivo brand guidelinesa: Libre Baskerville za bold i italic,
   Raleway za regular tekst. Samo dva fonta — trece bi bilo moje, ne njihovo. */
const baskerville = Libre_Baskerville({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
})
const raleway = Raleway({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
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
        <ScrollProvider />
        <Chrome />
        {children}
      </body>
    </html>
  )
}
