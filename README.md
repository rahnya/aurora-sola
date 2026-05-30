# SOLIA — Site vitrine du Centre de Contrôle Aurora

Plateforme officielle de communication de la cellule **SOLIA** (CCA).
Mission Odyssey IV → Kepler-452c · Programme AURORA · 2079.

Couvre les missions **SOC-03** (site vitrine) et **EVT01-C** (galerie photo).

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
