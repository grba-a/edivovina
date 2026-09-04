# Higgsfield input — Edivo "Navis Mysterium" amfora

## Kadrovi

| datoteka | kut | napomena |
|---|---|---|
| `1-front-studio.jpg` | sprijeda | obje ručke, pečat na čepu · **stalak i crvena vrpca su u kadru** |
| `2-profile-boat.jpg` | puni profil | leži na gliseru, čista podloga, **bez stalka** — najčišći kadar |
| `3-profile-boat-b.jpg` | profil, rotirana | ista postava |
| `4-profile-boat-c.jpg` | profil, rotirana | ista postava |
| `5-threequarter.jpg` | tri četvrtine | u rukama, bez stalka |
| `6-neck-detail.jpg` | grlo | čep i korijen ručki iz blizine |

**Nema pravog stražnjeg kadra.** Nizak rizik: amfora je rotacijski simetrična
osim dvije ručke i razmještaja kamenica.

## Što model MORA sadržavati

- dvije ručke, od vrata do ramena
- **šiljasti konični toe** — bez njega to nije amfora
- grubi čep na grlu (cement/pluto), s crvenim pečatom
- kamenice i bijela kalcificirana kora po tijelu, gušće na ramenu

## Što model NE SMIJE sadržavati

- **kovano željezno ležište** (u kadru 1 je, mora van)
- crvena kartonska vrpca i vrpca kojom je vezana
- drvena bačva, vinska čaša, polica s bocama, gliser, more, ruke

## Export

| | |
|---|---|
| format | **`.glb`** (glTF 2.0 binary), jedan mesh, jedan materijal |
| orijentacija | **Y-up**, amfora stoji uspravno, toe prema dolje |
| pivot | **centar tijela**, ne toe — oko njega se rotira u animaciji |
| trokuti | **≤ 40 000** (mobitel). Ako izađe 200k+, decimirati |
| tekstura | jedan baked albedo, **≤ 2048×2048**; normal/roughness ne trebaju |
| kompresija | Draco ili Meshopt, **ukupno ≤ 2 MB** |
| bez | animacija, kamera, svjetala, praznih nodeova |
