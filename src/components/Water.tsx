/**
 * VODENI STUPAC — pozadina naslovnice.
 *
 * Cisti CSS vezan na --descent (vidi src/lib/descent.ts): boja vode ide iz
 * teala u navy pa u abis kako se skrola, snopovi svjetla se njisu, marine snow
 * pada u tri sloja razlicitih brzina, dno se pojavi na kraju spusta.
 *
 * Prije je zivio unutar Chromea zajedno s navigacijom. Izdvojen je da atmosfera
 * ne ovisi o dizajnu koji je iznad nje.
 *
 * SERVER komponenta: nista ovdje ne treba JS.
 */
export default function Water() {
  return (
    <>
      <div className="ed-water" aria-hidden />
      <div className="ed-shafts" aria-hidden>
        <div className="ed-shaft" />
        <div className="ed-shaft" />
        <div className="ed-shaft" />
        <div className="ed-shaft" />
      </div>
      <div className="ed-snow" aria-hidden>
        <div className="ed-snow-layer" />
        <div className="ed-snow-layer" />
        <div className="ed-snow-layer" />
      </div>
      <div className="ed-floor" aria-hidden />
    </>
  )
}
