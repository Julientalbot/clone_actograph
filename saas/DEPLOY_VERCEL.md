# Déployer ActoGraph Pro sur Vercel

## 1. Préparation

### Variables d'environnement requises
- `NEXT_PUBLIC_SUPABASE_URL`: URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clé publique (anon) de Supabase

## 2. Déploiement Initial

### Option A: Via Vercel Dashboard
1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Importez votre repository GitHub
3. **IMPORTANT**: Configurez le Root Directory sur `saas`
4. Ajoutez les variables d'environnement
5. Cliquez sur "Deploy"

### Option B: Via Vercel CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Dans le dossier racine du projet
vercel

# Suivez les instructions et choisissez:
# - Link to existing project? No
# - What's your project's name? actograph-pro
# - In which directory is your code located? ./saas
# - Override settings? No
```

## 3. Configuration des Variables d'Environnement

Dans le dashboard Vercel :
1. Allez dans Project Settings > Environment Variables
2. Ajoutez :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://afxivyifxmdlquxlbtrl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 4. Domaine Personnalisé (Optionnel)

1. Dans Project Settings > Domains
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions DNS

## 5. Configuration Supabase

Dans votre tableau de bord Supabase :
1. Authentication > URL Configuration
2. Ajoutez votre URL Vercel aux Redirect URLs :
   ```
   https://votre-app.vercel.app/auth/callback
   https://votre-domaine.com/auth/callback
   ```

## 6. Redéploiement

Après avoir configuré les variables d'environnement :
```bash
vercel --prod
```

Ou poussez simplement sur GitHub pour un déploiement automatique.

## Troubleshooting

### Erreur 404
- Vérifiez que le Root Directory est bien configuré sur `saas`
- Vérifiez que le framework est détecté comme "Next.js"

### Erreur de Build
- Vérifiez les logs de build dans Vercel
- Assurez-vous que toutes les dépendances sont installées

### Problèmes d'Authentification
- Vérifiez les variables d'environnement
- Vérifiez les Redirect URLs dans Supabase