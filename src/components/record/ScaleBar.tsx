/**
 * Mjerilo. Ono sto crtez cini MJERENIM, a ne ilustracijom — i jedini element
 * koji publici ovog svijeta odmah kaze da je posuda stvarna i katalogizirana.
 */
export default function ScaleBar({ label = '10 cm' }: { label?: string }) {
  return (
    <div className="flex items-end gap-[var(--s-2)]" aria-hidden>
      <svg viewBox="0 0 60 10" className="h-[10px] w-[60px] text-plate-ink/55">
        <path
          d="M0 8h60M0 3v5M15 5v3M30 3v5M45 5v3M60 3v5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <span className="t-stamp text-plate-ink/45">{label}</span>
    </div>
  )
}
