/* ═══════════════════════════════════════════════════════════════════
   DONNÉES GALERIE · Archive visuelle Kepler-452c (EVT-01)
   ───────────────────────────────────────────────────────────────────
   Source unique de vérité pour la lightbox.
   Pour AJOUTER une image :
     1. Ajouter un objet dans le tableau GALLERY_DATA ci-dessous
     2. Ajouter le <article class="gallery__plate" data-i="N"> correspondant
        dans index.html (section galerie), avec le même index N
   Chaque légende expose : lieu (loc), date, astronaute (op) - requis EVT01-C
   ═══════════════════════════════════════════════════════════════════ */
const GALLERY_DATA = [
  {
    id: 'KEP-452C-001',
    title: 'Première lumière',
    loc: 'Orbite basse · Hémisphère jour',
    date: '2079.05.29',
    time: '14:23:17 UTC',
    op: 'Lt. A. Laurent',
    inst: 'Camera Alpha · 850mm',
    coord: '19.78°N / 142.31°E',
    exp: '1/250s · f/2.8',
    src: 'Odyssey IV',
    desc: "Première image haute résolution transmise par l'Odyssey IV depuis l'orbite basse de Kepler-452c. Atmosphère riche en aérosols, signature compatible avec les modèles préliminaires de 2074."
  },
  {
    id: 'KEP-452C-002',
    title: "Vallée d'Aurelia",
    loc: 'Zone Alpha · Plateau central',
    date: '2079.05.29',
    time: '14:31:42 UTC',
    op: 'Lt. A. Laurent',
    inst: 'Camera Alpha · Stéréo',
    coord: '19.45°N / 142.18°E',
    exp: '1/500s · f/4.0',
    src: 'Odyssey IV',
    desc: "Survol basse altitude de la vallée d'Aurelia. Formations rocheuses stratifiées au premier plan suggérant une activité sédimentaire passée et un possible cycle hydrologique."
  },
  {
    id: 'KEP-452C-003',
    title: 'Limbe atmosphérique',
    loc: 'Terminator est · Orbite basse',
    date: '2079.05.29',
    time: '15:02:08 UTC',
    op: 'Cdt. E. Ripley',
    inst: 'Camera Beta · Large champ',
    coord: 'Terminator est',
    exp: '1/60s · f/2.0',
    src: 'Odyssey IV',
    desc: "Vue de l'atmosphère au passage du terminator. Couches stratifiées visibles : troposphère lavande riche en aérosols, mésosphère dorée, possible activité chimique."
  },
  {
    id: 'KEP-452C-004',
    title: 'Formations stratifiées',
    loc: 'Site K4A · Massif Sud',
    date: '2079.05.29',
    time: '16:14:33 UTC',
    op: 'Dr. S. Patel',
    inst: 'Camera Alpha · Téléobjectif',
    coord: '12.34°S / 87.62°E',
    exp: '1/125s · f/5.6',
    src: 'Odyssey IV',
    desc: "Détail des formations stratifiées du Site K4A. Strates colorées indiquant des dépôts successifs sur des échelles géologiques importantes. Glints minéraux compatibles avec présence de silicates."
  },
  {
    id: 'KEP-452C-005',
    title: 'Coucher double sur Cassini',
    loc: 'Horizon ouest · Plateau Cassini',
    date: '2079.05.29',
    time: '18:47:55 UTC',
    op: 'Spc. N. Davis',
    inst: 'Camera Beta · Panoramique',
    coord: '04.21°N / 211.07°E',
    exp: '1/800s · f/8.0',
    src: 'Odyssey IV',
    desc: "Coucher de l'étoile hôte Kepler-452 depuis le plateau Cassini. Premier crépuscule observé par un équipage humain sur un monde extrasolaire."
  }
];
