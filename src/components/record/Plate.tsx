/**
 * Ploca. Svijetli materijal koji PLUTA nad vodom.
 *
 * Pravilo koje cuva amforu: ploca nikad ne ide od ruba do ruba. Oko svake
 * ostaje voda, pa amfora prolazi izmedu i iza ploca cijelim spustom. To je
 * ujedno ritam stranice: ploca, voda, ploca.
 */
export default function Plate({
  children,
  as: Tag = 'div',
  className = '',
  enter = false,
  delay = 0,
}: {
  children: React.ReactNode
  as?: 'div' | 'article' | 'section' | 'li'
  className?: string
  enter?: boolean
  delay?: number
}) {
  return (
    <Tag
      className={`plate relative ${enter ? 'plate-in' : ''} ${className}`}
      style={enter && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
