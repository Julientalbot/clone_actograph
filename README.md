# ActoGraph Pro - Analyse Ergonomique SaaS

Plateforme SaaS professionnelle d'analyse ergonomique et de chronométrage pour les études de postes de travail, développée avec Next.js et Supabase.

## 🚀 Fonctionnalités

### 🔐 **Authentification & Gestion**
- Inscription et connexion sécurisée avec Supabase
- Gestion d'équipes et organisations
- Profils utilisateur personnalisés
- Authentification par email avec vérification

### 📊 **Analyse & Chronométrage**
- **Chronométrage haute précision** - Timer avec affichage au centième de seconde
- **Enregistrement d'activités** - Système de catégorisation ergonomique (5 types prédéfinis)
- **Analytics avancés** - Graphiques interactifs avec Chart.js (Doughnut, Bar, Line)
- **Sessions illimitées** - Gestion complète des sessions d'analyse
- **Chronogramme visuel** - Timeline interactive avec statistiques détaillées

### 🎥 **Analyse Vidéo**
- **Lecteur vidéo intégré** - Upload par drag & drop pour analyse des mouvements
- **Synchronisation temps réel** - Corrélation vidéo/chronométrage
- **Interface responsive** - Optimisé pour desktop et mobile

### 📱 **Progressive Web App (PWA)**
- **Installation native** - Disponible sur bureau et mobile
- **Mode hors ligne** - Fonctionnement sans connexion internet
- **Service Worker** - Cache intelligent et synchronisation automatique
- **Mode sombre/clair** - Interface adaptative selon les préférences

## 🛠 Technologies

### **Backend & Infrastructure**
- **Next.js 15.4.2** - Framework React full-stack moderne
- **Supabase** - Backend-as-a-Service avec authentification et base de données
- **TypeScript** - Typage statique pour robustesse et productivité

### **Frontend & UI**
- **React 19** - Bibliothèque UI moderne avec hooks avancés
- **Tailwind CSS** - Framework CSS utilitaire avec mode sombre
- **Chart.js + React-chartjs-2** - Graphiques interactifs professionnels
- **Zustand** - Gestion d'état légère et performante

### **PWA & Performance**
- **Service Worker** - Cache offline et mise à jour automatique
- **Web App Manifest** - Installation native multi-plateforme
- **React Hot Toast** - Notifications utilisateur élégantes

## 🚀 Démarrage Rapide

### **Prérequis**
- Node.js 18+ et npm
- Compte Supabase (gratuit)

### **Installation**

```bash
# Cloner le repository
git clone https://github.com/Julientalbot/clone_actograph.git
cd clone_actograph

# Installer les dépendances
cd saas
npm install

# Configuration Supabase
cp .env.local.example .env.local
# Éditer .env.local avec vos clés Supabase
```

### **Variables d'environnement**

Créer `.env.local` dans le dossier `saas/` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Démarrage en développement**

```bash
# Démarrer le serveur de développement
npm run dev

# L'application sera accessible sur http://localhost:3000
```

### **Build de production**

```bash
# Construire pour la production
npm run build

# Démarrer le serveur de production
npm start
```

## 📱 Installation PWA

L'application peut être installée comme une app native :

1. **Sur desktop** - Cliquez sur l'icône d'installation dans la barre d'adresse
2. **Sur mobile** - Utilisez "Ajouter à l'écran d'accueil" 
3. **Via l'app** - Utilisez le prompt d'installation intégré

## 🏗 Architecture

```
saas/
├── src/
│   ├── app/                 # Pages Next.js (App Router)
│   │   ├── dashboard/       # Interface principale authentifiée
│   │   ├── login/          # Connexion
│   │   ├── signup/         # Inscription  
│   │   └── offline/        # Page hors ligne
│   ├── components/         # Composants React réutilisables
│   │   ├── Timer.tsx       # Chronométrage haute précision
│   │   ├── ActivityPanel.tsx # Gestion des activités
│   │   ├── VideoPlayer.tsx # Lecteur vidéo avec drag&drop
│   │   ├── TimelineChart.tsx # Chronogramme visuel
│   │   └── AnalyticsDashboard.tsx # Graphiques avancés
│   ├── hooks/             # Hooks React personnalisés
│   ├── store/             # Gestion d'état Zustand
│   └── lib/               # Utilitaires et configuration Supabase
├── public/                # Assets statiques et PWA
└── supabase-setup.sql    # Script de configuration base de données
```

## 🔒 Sécurité & Conformité

- **RGPD compliant** - Gestion des données utilisateur transparente
- **Authentification sécurisée** - Chiffrement bout en bout avec Supabase
- **Normes ergonomiques** - Compatible ISO et EN pour études professionnelles
- **Audit de code** - ESLint et TypeScript strict activés

## 📈 Fonctionnalités Prochaines

- Export PDF/Excel avancé
- Templates sectoriels personnalisables
- API publique pour intégrations
- Analytics prédictifs avec IA
- Collaboration temps réel multi-utilisateurs

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez les [issues](https://github.com/Julientalbot/clone_actograph/issues) pour les fonctionnalités demandées.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**ActoGraph Pro** - Transformez vos analyses ergonomiques avec la puissance du cloud ⚡️