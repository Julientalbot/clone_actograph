# ActoGraph Clone

Un outil d'analyse ergonomique et de chronométrage pour les études de poste de travail, développé avec React et TypeScript.

## Fonctionnalités

- **Chronométrage haute précision** - Timer avec affichage au centième de seconde
- **Enregistrement d'activités** - Système de catégorisation avec 5 types d'activités prédéfinies
- **Lecteur vidéo intégré** - Upload et lecture de vidéos pour l'analyse des mouvements
- **Visualisation chronographique** - Graphiques temporels avec statistiques détaillées
- **Interface responsive** - Design adaptatif pour desktop et mobile

## Technologies utilisées

- **React 19.1.0** - Framework frontend moderne
- **TypeScript 5.8.3** - Typage statique pour une meilleure robustesse
- **Vite 7.0.4** - Outil de build rapide
- **Tailwind CSS 4.1.11** - Framework CSS utilitaire
- **Video.js** - Bibliothèque de lecture vidéo avancée

## Installation et démarrage

```bash
# Cloner le repository
git clone https://github.com/votre-username/clone_actograph.git
cd clone_actograph

# Installer les dépendances
cd client
npm install

# Démarrer le serveur de développement
npm run dev
```

## Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Linting
npm run lint

# Prévisualisation du build
npm run preview

# Vérification TypeScript
npx tsc --noEmit
```

## Structure du projet

```
client/
├── src/
│   ├── components/          # Composants React
│   │   ├── ActivityPanel.tsx    # Panneau d'activités
│   │   ├── Timer.tsx            # Chronométre
│   │   ├── VideoPlayer.tsx      # Lecteur vidéo
│   │   └── TimelineChart.tsx    # Graphique chronologique
│   ├── App.tsx             # Application principale
│   └── main.tsx            # Point d'entrée
├── public/                 # Assets publics
└── package.json            # Dépendances et scripts
```

## Utilisation

1. **Chronométrage** - Utilisez le timer pour mesurer précisément les durées
2. **Enregistrement d'activités** - Cliquez sur les boutons d'activité pour logger les tâches
3. **Analyse vidéo** - Importez une vidéo pour synchroniser l'observation
4. **Visualisation** - Consultez le chronogramme pour analyser les données

## Types d'activités

- **Préparation** (bleu) - Mise en place, préparation du poste
- **Travail principal** (vert) - Tâches productives principales
- **Pause** (jaune) - Temps de repos, pauses
- **Attente** (rouge) - Temps d'attente, blocages
- **Communication** (violet) - Interactions, échanges

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir des issues ou proposer des pull requests.

## License

Ce projet est distribué sous licence MIT.