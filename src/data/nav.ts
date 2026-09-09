/**
 * NAVIGACIJA — poredana po DUBINI, kao sekcije na naslovnici.
 *
 * Svaka podstranica sjedi na postaji s naslovnice koja pokriva istu temu, pa
 * izbornik nije abecedni popis nego presjek mora: prvo povrsina, zadnje dno.
 * Isti redoslijed u headeru i u footeru — otud jedan izvor istine, da ne mogu
 * driftati.
 *
 * Imena su NJIHOVA, s edivovina.hr.
 */
import { station } from '@/data/stations'

export type NavItem = { href: string; label: string; m: number }

export const NAV: NavItem[] = [
  { href: '/visit', label: 'Visit Us', m: station('surface').m },
  { href: '/about', label: 'About Us', m: station('winery').m },
  { href: '/wines', label: 'Wines', m: station('shop').m },
  { href: '/news', label: 'News & Stories', m: station('press').m },
  { href: '/gallery', label: 'Gallery', m: station('awards').m },
  { href: '/contact', label: 'Contact', m: station('seabed').m },
].sort((a, b) => a.m - b.m)
