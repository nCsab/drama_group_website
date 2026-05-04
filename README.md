# Csalamádé - Diákszínjátszó Tábor

A Csalamádé diákszínjátszó tábor weboldalának forráskódja. A frontend Next.js (App Router), Tailwind CSS és TanStack Query technológiák felhasználásával készült.

---

## Szakmai és FFT Dokumentáció

A projekthez készült egy részletes dokumentáció (Felhasználói Felületek Tervezése és szoftverarchitektúra témakörben). A dokumentáció bemutatja az alkalmazott technológiákat és a fejlesztés során hozott döntéseket:
- Next.js SSR és SEO optimalizáció.
- Intersection Observer API használata a kártyák navigációjához (mobilos nézet).
- TanStack Query az állapotkezeléshez és gyorsítótárazáshoz.
- GSAP animációk teljesítményoptimalizálása.

A teljes dokumentáció itt olvasható:
[Dokumentáció (PDF)](./docs/Csalamade_Documentation.pdf)
*(A LaTeX forráskód a `docs/Csalamade_Documentation.tex` fájlban található.)*

---

## Technológiai Stack

- Frontend: Next.js 14+ (React App Router)
- Stílusok: Tailwind CSS
- Animációk: GSAP
- Adatkezelés: TanStack Query (React Query)
- Optimalizáció: next-cloudinary, WebP formátumú képek
- Lokalizáció: React Context alapú nyelvi modul (HU, EN, RO)

---

## Futtatás lokálisan

```bash
# Függőségek telepítése
npm install
# vagy
yarn install

# Fejlesztői szerver indítása
npm run dev
# vagy
yarn dev
```

Az oldal a [http://localhost:3000](http://localhost:3000) címen lesz elérhető.

---

## Főbb Funkciók
1. Dinamikus nyitóoldal animált hátterekkel.
2. Táborok böngészése interaktív kártyás elrendezésben, beépített YouTube videókkal.
3. Átirányítás a külső jelentkezési űrlapokra egyedi animációkkal.
4. Teljesen reszponzív, mobilra optimalizált elrendezés.

---
Készítette: Nagy Csaba - Számítástechnika IV.
