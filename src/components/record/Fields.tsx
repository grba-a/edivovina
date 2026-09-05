/**
 * Polja zapisa. Tabularne brojke, natpis lijevo, vrijednost desno, crtkana
 * vodilica izmedu — kao u katalogu nalaza.
 *
 * Ovdje putuje argument koji opravdava cijenu: CTX i DUR su POLJA, pa "zasto je
 * ovo €382" stoji unutar kartice a ne u sekciji koju kupac mozda nikad ne vidi.
 */
export type Field = [label: string, value: string]

export default function Fields({ items, dense = false }: { items: Field[]; dense?: boolean }) {
  return (
    <dl className="t-field">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="flex items-baseline gap-[var(--s-2)]"
          style={{ paddingBlock: dense ? 'var(--s-1)' : 'var(--s-2)' }}
        >
          <dt className="t-stamp shrink-0 text-plate-ink/45">{label}</dt>
          <span aria-hidden className="min-w-[var(--s-5)] flex-1 self-center border-b border-dotted border-plate-ink/25" />
          <dd className="shrink-0 text-plate-ink/85">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
