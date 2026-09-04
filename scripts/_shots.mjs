import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2];
const widths = process.argv.slice(3).map(Number);
const routes = ['/', '/wines', '/wines/navis-mysterium-tris', '/wines/navis-mysterium-amphora', '/story', '/visit', '/gallery', '/contact'];
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  for (const r of routes) {
    await p.goto('http://localhost:4200' + r, { waitUntil: 'load' });
    await p.waitForTimeout(400);
    await p.evaluate(() => Promise.all(Array.from(document.images).filter(i=>!i.complete).map(i=>new Promise(res=>{i.addEventListener('load',res);i.addEventListener('error',res)}))));
    await p.waitForTimeout(600);
    const name = (r === '/' ? 'home' : r.replace(/\//g, '_').replace(/^_/, ''));
    await p.screenshot({ path: `${OUT}/${w}-${name}.png`, fullPage: true });
  }
  await ctx.close();
  console.log('done', w);
}
await b.close();
