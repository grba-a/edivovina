# Edivo Vina — web

Redizajn za [Edivo Vina](https://www.edivovina.hr/) (Janjina / Drače, Pelješac) —
prvu podmorsku vinariju u svijetu. Plavac Mali odleži 3 mjeseca na kopnu, pa u
glinenim amforama 700+ dana u potonulom ribarskom brodu na ~25 m.

**Ovo je dizajnerski template.** Prodaja nije živa: nema košarice ni Stripea.
Katalog dolazi iz jednog data filea čiji je oblik namjerno mapiran na
WooCommerce polja, jer se dizajn poslije prepisuje u Breakdance + WooCommerce.

## Koncept: pad JE starenje

Amfora ne pada samo od hera do footera — **postaje obraštena dok pada**.
Scroll = dubina = 700 dana. Jedan neprekinut potez, bez povratka gore.

| poglavlje | posao |
|---|---|
| 01 Hero | želja |
| 02 Reveal | bez daha, bez CTA-a |
| 03 The Three | objasni **i** zatvori u istom kadru |
| 04 Bottles | ulaz po jednoj boci |
| 05 Proof | medalje i mediji u jednoj traci |
| 06 Close | dvije odluke i ništa drugo |

## Brend

Sve iz *Edivo Brand Identity — Logo and Color Guide* (svibanj 2024). Ništa nije
izabrano; sve su njihove vrijednosti.

| | |
|---|---|
| Zlato | `#D2AC67` — Pantone 7509C |
| Brend boja | `#09334E` — Pantone 7463C |
| Regular tekst | Raleway |
| Bold & Italic | Libre Baskerville |

Vodeni stupac ide **teal → njihov navy → navy potamnjen**, pa je dubina ujedno
i put do brend boje.

## Stack

Next.js 16 (App Router) · Tailwind v4 · GSAP ScrollTrigger · Lenis ·
React Three Fiber

### 3D amfora

Nema `.glb` i nije rađena u Blenderu. `LatheGeometry` iz profila izmjerenog s
klijentovih fotografija (`src/components/bottle/amphora.ts`) — ~20 točaka
umjesto 5–30 MB assetа. Obraštaj je dvoslojan: kalcificirana kora u shaderu i
**instancirane kamenice** (46) koje se pojavljuju jedna po jedna kako `--descent`
raste. Alge (96 instanci) izrastu i valovito se miču, sve u shaderu.

## Prenosivost u Breakdance

`--descent` (0 = površina, 1 = dno) je **jedini ulaz** cijelog vizualnog sustava.
Piše ga `src/lib/descent.ts` u ~15 linija; sve ostalo — boja vode, snopovi
svjetla, marine snow, morsko dno, dubinomjer — je čisti CSS u
`src/styles/descent.css`.

Zato animirani dijelovi koriste **obične CSS klase, ne Tailwind utilities**
(Tailwinda u Breakdanceu nema). GSAP radi samo ono što stvarno visi o poziciji
elementa (reveal maske, parallax).

Ulazna animacija hera je čisti CSS, ne GSAP: naslov na GSAP-u digne mobilni LCP
na ~5 s jer tekst fizički ne postoji dok se bundle ne skine.

## Skripte

```bash
npm run dev                      # port 4200
node scripts/build-photos.mjs    # ~/Downloads/Edivo -> public/photo/*.webp
node scripts/grade-images.mjs    # .cache/raw -> public/img/*.webp (stariji set)
node scripts/check-routes.mjs    # sve rute, desktop + mobitel
node scripts/check-mobile.mjs    # pravi WebKit na 360/390/430
node scripts/shots.mjs           # snimke spusta kroz Lenis
```

`check-*` skripte traže dev server na 4200 i izlaze s kodom 1 ako nađu problem.
Provjeravaju ono što oko promaši: horizontalni scroll, elemente zaglavljene na
`opacity: 0`, tap targete pod 40 px, slike bez `width`/`height`, HTTP 4xx.

## Čeka klijenta

1. **Brojke se ne poklapaju po izvorima.** Dubina: 18–25 m (njihov web), 20 m
   (Euronews), 14 m (jedan izvor). Trajanje: „700+ dana" vs „18–24 mjeseca".
   Cijeli web stoji na tim brojkama u velikoj tipografiji — do potvrde koriste se
   njihove vlastite (25 m, 700 dana, `src/data/chapters.ts`).
2. **Ronilačke ture ne postoje više** — izbačene iz navigacije, footera i pressa.
3. Cijene i sadržaj degustacija: jedini javni podatak su pretkonverzijske kune.
   Zato na `/visit` **nema** cijena ni radnog vremena.
4. Mapiranje studijskih fotki na SKU izvedeno je iz etiketa i boje vina —
   potvrditi `p-sea-bottle` (plava vrpca).
5. **Video** (`Edivo Video/From Sea to Glass…`, 2 × ~37 MB, 1080p) nije ubačen:
   za web encode treba `ffmpeg`, koji nije instaliran na build mašini.
