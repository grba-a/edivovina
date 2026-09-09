'use client'

import { useState } from 'react'

export type Tab = { key: string; label: string; panel: React.ReactNode }

/**
 * `single-product/tabs/tabs.php`. Klase su Woove do zadnjeg modifikatora:
 * li je `{key}_tab`, panel je `woocommerce-Tabs-panel--{key}`.
 *
 * Woo ovo vozi jQueryjem i skriva panele CSS-om; ovdje je React state, jer
 * predlozak nema jQuery. Markup i ARIA su isti, pa rebuild ne mora misliti.
 */
export default function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.key)

  return (
    <div className="woocommerce-tabs wc-tabs-wrapper">
      <ul className="tabs wc-tabs flex flex-wrap gap-[var(--s-5)] border-b border-ivory/16" role="tablist">
        {tabs.map((t) => (
          <li key={t.key} role="presentation" className={`${t.key}_tab`} id={`tab-title-${t.key}`}>
            <button
              type="button"
              role="tab"
              aria-controls={`tab-${t.key}`}
              aria-selected={active === t.key}
              onClick={() => setActive(t.key)}
              className={`data-label -mb-px inline-flex min-h-11 items-end border-b-2 pb-[var(--s-3)] transition-colors duration-200 ${
                active === t.key ? 'border-gold text-gold' : 'border-transparent text-ivory/60 hover:text-ivory'
              }`}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      {tabs.map((t) => (
        <div
          key={t.key}
          id={`tab-${t.key}`}
          role="tabpanel"
          aria-labelledby={`tab-title-${t.key}`}
          hidden={active !== t.key}
          className={`woocommerce-Tabs-panel woocommerce-Tabs-panel--${t.key} panel entry-content wc-tab pt-[var(--s-5)]`}
        >
          {t.panel}
        </div>
      ))}
    </div>
  )
}
