# Portfolio Alegria (statique)

Site vitrine simple, 100% statique.

- Page principale: `client/index.html`
- Styles: `client/static-styles.css`
- Image avatar: `client/attached_assets/Avatar_NeckTeck.jpg`
- Aucune dépendance npm/vite requise

## Aperçu local

Ouvrir directement `client/index.html` dans le navigateur.

## Thème clair/sombre

Le bouton en haut à droite (☼/☾) bascule le thème et mémorise le choix dans `localStorage`. Palette claire activée via `html[data-theme="light"]`.

## Recadrage avatar

Paramètres dans `client/static-styles.css` (en haut du fichier):

```css
--avatar-x: 88%;
--avatar-y: 120%;
--avatar-scale: 1.9;
```

Ajuster pour centrer/zoomer le visage.

## Déploiement (options)

- GitHub Pages: publier le dossier `client/`.
- Netlify/Vercel: pointer le répertoire `client/`.

## Licence

MIT (à adapter).
