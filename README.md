# SOLA — Site vitrine du Centre de Contrôle Aurora

Plateforme officielle de communication de la cellule **SOLA** (CCA).
Mission Odyssey IV → Kepler-452c · Programme AURORA · 2079.

Couvre les missions **SOC-03** (site vitrine), **EVT01-C** (galerie photo),
**EVT09-D** (section découverte) et **EVT11-D** (centre de crise en ligne).

## Liens officiels

- **Dépôt GitHub** : [github.com/rahnya/aurora-sola](https://github.com/rahnya/aurora-sola)  
  (`github.com/rahnya/aurora-solia` redirige vers ce dépôt)
- **Site live (GitHub Pages)** : [rahnya.github.io/aurora-sola](https://rahnya.github.io/aurora-sola/)

## Lancer
Site statique 100 % autonome. Ouvrir `index.html` dans un navigateur,
ou déposer le dossier sur GitHub Pages / Netlify / Vercel.

## Architecture (composants séparés)
```
index.html                 page assemblée
assets/
  css/
    variables.css          (palette, typos) — point d'entrée pour rebrander
    base.css               reset, utilitaires, accessibilité
    main.css               atmosphère (starfield, grain, vignette)
    header.css … footer.css  un fichier par composant
    lightbox.css
    responsive.css         media queries + reduced-motion
  js/
    starfield.js           champ d'étoiles + étoiles filantes (canvas)
    header.js              scroll state · barre de progression · menu mobile · scrollspy
    reveal.js              apparition au scroll (IntersectionObserver)
    lightbox.js            visionneuse galerie (clavier + tactile)
    smooth-scroll.js       ancres fluides
    main.js                bootstrap (initialise tous les modules)
  data/
    gallery-data.js        métadonnées des images (source unique de vérité)
```

## Étendre
- **Ajouter une image** : un objet dans `assets/data/gallery-data.js`
  + un `<article class="gallery__plate" data-i="N">` dans `index.html`.
- **Ajouter une transmission** : copier un `<article class="feed__item">`.
- **Changer la charte** : `assets/css/variables.css`.

## Section Découverte — EVT09-D (nouveau)
Section monumentale dédiée à l'événement majeur (détection d'un signal d'origine
inconnue dans la Vallée d'Aurelia). Tout est dans `#discovery` (`index.html`) et
`assets/css/discovery.css`.
- **Chronologie** : ajouter/éditer un `<li class="dtimeline__step">` (classe
  `dtimeline__step--live` pour l'étape « en cours »).
- **Données scientifiques** : trois `.dcard` — spectre (SVG), indicateurs, localisation.
  Le spectre se modifie via le `d="…"` des deux `<path>` (fill + line).
- **FAQ** : `<details class="dfaq">` natifs (accessibles, sans JS) — copier un bloc
  pour ajouter une question.
- **Futures mises à jour** : bloc `.discovery__updates`, prévu pour accueillir les
  prochains relevés au fil de l'analyse.
- Le lien de nav (desktop + mobile) et l'entrée dans `SECTION_IDS`
  (`assets/js/section-scroll.js`) sont déjà câblés.

## Centre de crise — EVT11-D
Section urgence `#crise` (après `#latest`, avant `#about`) — source unique
officielle en situation de crise médiatique. Styles : `assets/css/crise.css`.
- **Sysbar** : CTA public « Centre de crise » → `#crise` ; horodatage mission.
- **Fil horodaté** : articles `.cfeed__item` avec heure UTC + date.
- **Démentis** : blocs `.cdenial` (DEM-01, DEM-02, …).
- **Preuves** : cartes `.cproof` avec liens internes (`#latest`, `#discovery`, `#gallery`).
- **Vidéo équipage** : placeholder `.cvideo__frame` (sans lecteur externe).
- **FAQ** : `<details class="cfaq">` natifs — pas de classes `.reveal`, design sobre.
- Nav header / mobile / footer + entrée `crise` dans `SECTION_IDS` après `latest`.

## Corrections & améliorations (éd. 5)
- 🐛 **Lightbox réparée** : `gallery-data.js` n'était jamais chargé → la visionneuse plantait. Désormais branché.
- 🐛 **Atmosphère réparée** : `main.css` n'était pas lié → le fond occupait le flux et poussait le hero hors écran. Lié.
- 📱 **Menu mobile** : la navigation disparaissait sans remplacement < 900px → panneau plein écran (burger).
- 🛰 **Légende astronaute** visible sur chaque image (exigence EVT01-C : lieu · date · astronaute).
- 🎯 **Scrollspy** : lien de navigation actif selon la section.
- 📊 **Barre de progression** de lecture (or).
- ♿ **Accessibilité** : lien d'évitement, focus visible, aria sur menu/lightbox.
- 🔗 **Partage** : Open Graph / Twitter Card, favicon SVG, theme-color.
- ✨ Halo respirant + lueur d'horizon sur le hero.
