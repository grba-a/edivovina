import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/page/PageShell'
import PageOpen from '@/components/page/PageOpen'
import Station from '@/components/station/Station'
import Frame from '@/components/ui/Frame'
import { station } from '@/data/stations'
import { POSTS, ARCHIVE, ARCHIVE_HREF, type Post } from '@/data/posts'
import { MARKS } from '@/data/press'

const S = station('press')

export const metadata: Metadata = {
  title: 'News & Stories — Edivo Vina',
  description:
    'National Geographic Traveller, PBS, Euronews, Forbes and Atlas Obscura on the underwater cellar off Pelješac.',
}

/**
 * /news — 18 m, postaja `press`. BLOG, u formi njihove /news-stories:
 * naslovna slika, naslov, datum, izvadak, „Read more".
 *
 * Sadrzaj je kuriran, ne prepisan. Njihov arhiv ima 62 unosa i gotovo sve je
 * preslikan tudi tisak objavljen kao vlastiti post — od 60 prikazanih 51 je
 * prije 2022. Linkamo na izvor i pisemo NASU jednu recenicu; tudi tekst se ne
 * uvozi. Naslovne slike su nase fotografije, ne screenshotovi clanaka.
 */
function Card({ post }: { post: Post }) {
  const inner = (
    <>
      <div className="ed-plate">
        <Frame
          name={post.image}
          alt=""
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          ratio={3 / 2}
          className="w-full"
        />
      </div>

      <p className="data-label-sm mt-[var(--s-4)] flex flex-wrap items-baseline gap-x-[var(--s-3)] text-gold">
        {post.outlet}
        <span className="tnum text-ivory/45">{post.dateLabel}</span>
      </p>

      <h3 className="t-title mt-[var(--s-2)] text-ivory transition-colors duration-200 group-hover:text-gold">
        {post.title}
      </h3>

      <p className="t-field mt-[var(--s-3)] max-w-[44ch] text-ivory/68">{post.excerpt}</p>

      <span className="data-label mt-auto pt-[var(--s-5)] text-ivory/60 transition-colors duration-200 group-hover:text-gold">
        Read more →
      </span>
    </>
  )

  return (
    <article className="flex h-full flex-col">
      <a
        href={post.href}
        target="_blank"
        rel="noreferrer"
        className="pressable group flex h-full flex-col"
      >
        {inner}
      </a>
    </article>
  )
}

export default function NewsPage() {
  return (
    <PageShell data={S}>
      <PageOpen
        data={S}
        side="l"
        title="What others have written."
        lead="We link out rather than reprint. Every entry is somebody else’s reporting, in their own place, with one line from us about what is in it."
        meta={`${POSTS.length + ARCHIVE.length} entries`}
      />

      {/* PRIJE kartica: jedan kompaktan red, ne vlastita sekcija s naslovom.
          Prije su tu bila dva pravila jedno pod drugim (zatvaranje otvaranja i
          vrh mreze) s praznim pojasom izmedu. */}
      <Station data={S} side="r" stage={false} style={{ paddingTop: 'var(--s-6)', paddingBottom: 'var(--s-7)' }}>
        <div className="ed-in relative z-10">
          <div className="flex flex-wrap items-baseline gap-x-[var(--s-6)] gap-y-[var(--s-2)]">
            <h2 className="data-label shrink-0 text-gold">Covered by</h2>
            {MARKS.map((m) => (
              <span key={m} className="t-title text-ivory/75">
                {m}
              </span>
            ))}
          </div>
        </div>
      </Station>

      <section style={{ paddingBottom: 'var(--sec-y-tight)' }}>
        <div className="ed-in">
          <ul className="grid gap-x-[var(--s-6)] gap-y-[var(--s-8)] border-t border-ivory/14 pt-[var(--s-7)] sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((post) => (
              <li key={post.href + post.title}>
                <Card post={post} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* POSLIJE kartica: jedan blok. Naslov i link dijele red, popis je
          dvostupcani i tijesan, i zatvara jedan slim red — prije su tu bila
          tri odvojena bloka s po jednim pravilom. */}
      <section style={{ paddingBottom: 'var(--sec-y)' }}>
        <div className="ed-in">
          <div className="flex flex-wrap items-baseline justify-between gap-[var(--s-3)] border-t border-ivory/16 pt-[var(--s-6)]">
            <h2 className="t-title text-ivory">Earlier coverage</h2>
            <a
              href={ARCHIVE_HREF}
              target="_blank"
              rel="noreferrer"
              className="data-label -my-[var(--s-3)] inline-flex min-h-11 items-center text-ivory/60 hover:text-gold"
            >
              Full archive on edivovina.hr →
            </a>
          </div>

          <dl className="mt-[var(--s-4)] grid gap-x-[var(--s-8)] md:grid-cols-2">
            {ARCHIVE.map((a) => (
              <div key={a.title} className="ed-row">
                <dt className="data-label-sm tnum shrink-0 text-ivory/45">{a.dateLabel}</dt>
                <dd className="t-field text-ivory/80">
                  {a.title}
                  <span className="text-ivory/45"> · {a.outlet}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-[var(--s-7)] flex flex-wrap items-center gap-[var(--s-5)] border-t border-ivory/16 pt-[var(--s-5)]">
            <p className="t-field max-w-[44ch] text-ivory/65">
              Every one of them came to see the same thing: a wine nobody can make twice.
            </p>
            <Link
              href="/wines"
              className="data-label pressable ml-auto bg-gold px-[var(--s-5)] py-[var(--s-4)] text-abyss transition-colors duration-200 hover:bg-ivory"
            >
              See the wines
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
