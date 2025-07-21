# ActoGraph Pro - Configuration

## 1. Base de données Supabase

1. Connectez-vous à votre tableau de bord Supabase : https://supabase.com/dashboard
2. Allez dans votre projet : https://supabase.com/dashboard/project/afxivyifxmdlquxlbtrl
3. Naviguez vers **SQL Editor** dans le menu de gauche
4. Copiez le contenu du fichier `supabase-setup.sql` et exécutez-le
5. Vérifiez que toutes les tables ont été créées dans l'onglet **Table Editor**

## 2. Configuration de l'authentification

1. Dans Supabase, allez dans **Authentication** > **Settings**
2. Configurez les **URL de redirection** :
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
3. Activez l'**Email confirmation** si souhaité

## 3. Variables d'environnement

Le fichier `.env.local` est déjà configuré avec vos clés Supabase.

## 4. Démarrage

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Fonctionnalités disponibles

- ✅ Page d'accueil avec tarification
- ✅ Inscription/Connexion
- ✅ Dashboard avec Timer intégré
- ✅ Gestion des sessions
- ✅ Multi-tenant avec organisations
- ✅ Sécurité Row Level Security (RLS)

## Prochaines étapes

1. **Exécuter le script SQL** dans Supabase
2. **Tester l'inscription** d'un utilisateur
3. **Configurer Stripe** pour les paiements (optionnel)
4. **Déployer sur Vercel** pour la production