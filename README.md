# RK GymShop Webáruház

Az RK GymShop egy modern, felhasználóbarát webáruház, amely edzőtermi felszerelések, táplálékkiegészítők és sportruházat értékesítésére specializálódott. A projekt Next.js keretrendszerrel, TypeScript nyelven készült, és a Supabase szolgáltatást használja adatbázisként és autentikációs megoldásként.

## Funkciók

- **Felhasználói regisztráció és bejelentkezés**: Biztonságos autentikáció a Supabase segítségével
- **Termék böngészés**: Termékek listázása, szűrése és keresése
- **Részletes termékoldal**: Részletes termékinformációk, képek és leírások
- **Kosár kezelés**: Termékek hozzáadása, eltávolítása és mennyiség módosítása
- **Fizetési folyamat**: Többlépcsős fizetési folyamat szállítási adatokkal
- **Felhasználói profil**: Személyes adatok és rendelési előzmények kezelése
- **Admin felület**: Termékek és rendelések kezelése, statisztikák megtekintése
- **Reszponzív design**: Mobilbarát felhasználói felület

## Technológiák

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Supabase
- **Adatbázis**: PostgreSQL (Supabase)
- **Autentikáció**: Supabase Auth
- **UI komponensek**: Framer Motion, Swiper, Recharts
- **Értesítések**: React Hot Toast
- **HTTP kérések**: Axios

## Telepítés

1. Klónozd a repót:
```bash
git clone [repo-url]
cd rk_gymshop
```

2. Telepítsd a függőségeket:
```bash
npm install
```

3. Hozz létre egy `.env.local` fájlt a következő környezeti változókkal:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Indítsd el a fejlesztői szervert:
```bash
npm run dev
```

5. Nyisd meg a [http://localhost:3000](http://localhost:3000) címet a böngészőben.

## Projekt struktúra

- `/src/pages`: Az alkalmazás oldalai és API végpontjai
- `/src/pages/components`: Újrafelhasználható komponensek
- `/src/pages/api`: Backend API végpontok
- `/src/helpers`: Segédfüggvények
- `/src/lib`: Külső szolgáltatások konfigurációja (pl. Supabase)
- `/src/services`: Adatkezelési szolgáltatások
- `/src/styles`: Globális stílusok

## Ismert problémák és megoldások

1. **Kosárba gomb a főoldalon**: A kosárba gomb eredetileg a termék részleteire navigált ahelyett, hogy csak a kosárba helyezte volna a terméket. Megoldás: `e.stopPropagation()` hozzáadása a kosárba gomb onClick eseménykezelőjéhez.

2. **Ajánlott termékek kártyái a kosár oldalon**: Az ajánlott termékek kártyáinak magassága nem volt egységes a hosszabb termékleírások miatt. Megoldás: `line-clamp-2`, `h-10` és `overflow-hidden` CSS osztályok hozzáadása a leírás szövegéhez.

## Fejlesztési tervek

- Fizetési gateway integrációja
- Termék értékelések és vélemények
- Kedvencek lista
- Bővített termékszűrési lehetőségek
- Email értesítések

## Licenc

[MIT](https://choosealicense.com/licenses/mit/)
