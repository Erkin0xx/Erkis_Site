# 🚀 QUICK START GUIDE - Erki Dashboard

## ⚠️ ERREUR ACTUELLE : Supabase 400

L'erreur que tu vois est normale ! Elle signifie qu'il n'y a pas encore d'utilisateur créé dans la base de données.

---

## 📋 ÉTAPES POUR DÉMARRER

### **Étape 1 : Vérifier la configuration Supabase**

1. Va sur : https://supabase.com/dashboard/project/lkvhwdcpiysieflkaczv/settings/api
2. Vérifie que les credentials correspondent à celles dans `.env.local`
3. Vérifie que le SQL a bien été exécuté :
   - Va sur : https://supabase.com/dashboard/project/lkvhwdcpiysieflkaczv/editor
   - Tu devrais voir les tables `profiles` et `r6_cache` dans le menu de gauche

---

### **Étape 2 : Activer l'Email Confirmation (IMPORTANT)**

⚠️ **Par défaut, Supabase exige la vérification d'email !**

**Option A : Désactiver la vérification d'email (RAPIDE - pour le dev)**

1. Va sur : https://supabase.com/dashboard/project/lkvhwdcpiysieflkaczv/auth/providers
2. Clique sur **"Email"** dans la liste des providers
3. Scroll jusqu'à **"Email Confirmation"**
4. **DÉSACTIVE** "Confirm email"
5. Clique sur **"Save"**

**Option B : Configurer un serveur email (PRODUCTION)**

Garde l'email confirmation activée et configure un provider SMTP.

---

### **Étape 3 : Créer le premier utilisateur (Admin)**

#### **3.1 - Créer le compte via l'app**

1. Redémarre le serveur dev :
   ```bash
   npm run dev
   ```

2. Va sur : http://localhost:3000

3. Clique sur **"Don't have an account? Sign up"**

4. Crée ton compte admin avec :
   - Email : `ton-email@example.com`
   - Password : Au moins 6 caractères

5. **Si l'email confirmation est activée** → Va vérifier ton email et clique sur le lien

6. **Si l'email confirmation est désactivée** → Tu seras redirigé vers `/pending`

#### **3.2 - Promouvoir le premier utilisateur en Admin**

1. Va sur Supabase : https://supabase.com/dashboard/project/lkvhwdcpiysieflkaczv/editor

2. Clique sur **"New query"**

3. **Option 1 : Si tu connais ton email**
   ```sql
   UPDATE public.profiles
   SET role = 'admin', is_approved = TRUE
   WHERE email = 'ton-email@example.com';
   ```

4. **Option 2 : Promouvoir le premier utilisateur**
   ```sql
   UPDATE public.profiles
   SET role = 'admin', is_approved = TRUE
   WHERE id = (
     SELECT id FROM public.profiles
     ORDER BY created_at ASC
     LIMIT 1
   );
   ```

5. **Clique sur "Run"**

6. **Rafraîchis la page** → Tu devrais avoir accès au dashboard !

---

### **Étape 4 : Vérifier que tout fonctionne**

1. **Logout** (si tu es sur `/pending`)

2. **Login** avec ton compte

3. Tu devrais arriver sur le **Dashboard** (Bento Grid)

4. Clique sur **"Admin"** dans la sidebar

5. Tu devrais voir le **panel d'administration**

---

## 🎮 Étape 5 : Configurer Rainbow Six (Optionnel)

**Les credentials Ubisoft sont déjà configurés dans `.env.local` !**

Pour tester le module R6 :

1. Assure-toi que le compte Ubisoft `baptiste.piegelin@gmail.com` existe et est vérifié

2. Connecte-toi au compte Ubisoft pour vérifier : https://account.ubisoft.com/

3. Les agents en arrière-plan vont implémenter le module R6 automatiquement

---

## 🐛 PROBLÈMES COMMUNS

### **Problème 1 : Redirect Loop (ERR_TOO_MANY_REDIRECTS)**

**Solution :** J'ai déjà corrigé le middleware. Redémarre le serveur :
```bash
# Arrête le serveur (Ctrl+C)
npm run dev
```

### **Problème 2 : "Profile not found"**

**Cause :** Le trigger automatique n'a pas créé le profil.

**Solution :** Exécute ce SQL dans Supabase :
```sql
-- Vérifier que le trigger existe
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Si le trigger n'existe pas, réexécute tout le fichier supabase-schema.sql
```

### **Problème 3 : "Invalid API key" ou "Auth session missing"**

**Cause :** Les credentials Supabase sont incorrectes.

**Solution :** Re-vérifie le `.env.local` avec les credentials de :
https://supabase.com/dashboard/project/lkvhwdcpiysieflkaczv/settings/api

---

## ✅ CHECKLIST DE VALIDATION

- [ ] Le SQL `supabase-schema.sql` a été exécuté
- [ ] Les tables `profiles` et `r6_cache` existent dans Supabase
- [ ] L'email confirmation est désactivée (ou configurée)
- [ ] Un compte utilisateur a été créé via `/login`
- [ ] Le compte a été promu en admin via SQL
- [ ] Je peux me connecter et voir le dashboard
- [ ] Le panel admin fonctionne (`/admin`)
- [ ] Le compte Ubisoft `baptiste.piegelin@gmail.com` est vérifié

---

## 🆘 BESOIN D'AIDE ?

Si ça ne marche toujours pas :

1. **Vérifie les logs du serveur** dans le terminal
2. **Vérifie les logs Supabase** : https://supabase.com/dashboard/project/lkvhwdcpiysieflkaczv/logs/explorer
3. **Ouvre la console du navigateur** (F12) et copie les erreurs

---

## 📞 PROCHAINE ÉTAPE

**Une fois que tu peux te connecter avec succès :**

Les 3 agents en arrière-plan vont finir d'implémenter :
- ✅ Module Rainbow Six complet
- ✅ Page Settings
- ✅ Tests et documentation

**Redis le guide si tu es bloqué !** 💪
