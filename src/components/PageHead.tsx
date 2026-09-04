export default function PageHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <header className="px-5 pb-14 pt-32 md:px-8 md:pb-20 md:pt-44">
      <div className="mx-auto w-full max-w-[92rem]">
        <p className="ed-fade data-label mb-6 text-gold" style={{ animationDelay: '0.1s' }}>
          {eyebrow}
        </p>
        <h1 className="max-w-[24ch] font-display text-[clamp(2.4rem,7vw,5.6rem)] leading-[0.92] tracking-[-0.02em] text-ivory">
          <span className="ed-mask">
            <span className="ed-line" style={{ animationDelay: '0.18s' }}>
              {title}
            </span>
          </span>
        </h1>
        {intro && (
          <p
            className="ed-fade mt-8 max-w-[52ch] font-display text-lg leading-[1.6] text-ivory/70 md:text-[1.35rem]"
            style={{ animationDelay: '0.4s' }}
          >
            {intro}
          </p>
        )}
      </div>
    </header>
  )
}
