# 🌍 Système de Gestion des Villes

## Vue d'ensemble

Ce système permet de gérer deux types de villes sur la carte :
- **Villes visitées** : Affichées avec des points roses statiques
- **Villes wishlist** : Affichées avec des points roses **clignotants**

## 📦 Installation

### 1. Exécuter la migration SQL

Connecte-toi à ton projet Supabase et exécute le fichier :
```bash
supabase/migrations/20251211_create_cities_table.sql
```

Ou via l'interface Supabase :
1. Va dans **SQL Editor**
2. Copie le contenu du fichier de migration
3. Exécute la requête

### 2. Vérifier la table

La table `cities` contient :
- `id` : UUID unique
- `user_id` : Référence à l'utilisateur
- `name` : Nom de la ville
- `country` : Pays
- `latitude` / `longitude` : Coordonnées GPS
- `status` : `'visited'` ou `'wishlist'`
- `visit_date` : Date de visite (optionnel)
- `notes` : Notes personnelles

## 🎯 Utilisation actuelle

### Sur la landing page

**Villes visitées (statiques) :**
- New York 🇺🇸
- Miami 🇺🇸
- Paris 🇫🇷
- Munich 🇩🇪
- Sofia 🇧🇬
- Marrakech 🇲🇦
- Barcelona 🇪🇸
- Valencia 🇪🇸
- Toulouse 🇫🇷
- Limoges 🇫🇷
- Rome 🇮🇹
- Palermo 🇮🇹

**Ville wishlist (clignotante) :**
- Tokyo 🇯🇵 ⚡

## 🔮 Prochaines étapes

### 1. Page de gestion des villes dans Settings

Créer une interface dans `/dashboard/settings` avec :
- **Tableau des villes visitées**
  - Liste avec nom, pays, date de visite
  - Bouton "Supprimer"
  - Bouton "Déplacer vers wishlist"

- **Tableau des villes wishlist**
  - Liste avec nom, pays
  - Bouton "Supprimer"
  - Bouton "Marquer comme visitée"

- **Formulaire d'ajout**
  - Champ : Nom de la ville
  - Champ : Pays
  - Autocomplete pour coordonnées GPS
  - Radio : Visitée / Wishlist
  - Date de visite (si visitée)

### 2. API Routes à créer

```typescript
// app/api/cities/route.ts
// GET: Récupérer toutes les villes de l'utilisateur
// POST: Ajouter une nouvelle ville

// app/api/cities/[id]/route.ts
// PATCH: Modifier une ville (changement de status, etc.)
// DELETE: Supprimer une ville
```

### 3. Connecter la landing page à la DB

Modifier `app/page.tsx` pour :
```typescript
// Au lieu de markers hardcodés
const { data: cities } = await supabase
  .from('cities')
  .select('*')
  .eq('user_id', user.id);

const markers = cities.map(city => ({
  lat: city.latitude,
  lng: city.longitude,
  size: 0.3,
  blink: city.status === 'wishlist', // Clignote si wishlist
}));
```

## 🎨 Personnalisation

### Modifier l'animation de clignotement

Dans `components/ui/magicui-dotted-map.tsx` :
```typescript
animate={
  marker.blink
    ? {
        opacity: [0.75, 0.3, 0.75], // Intensité
        scale: [1, 1.3, 1],         // Taille
      }
    : {}
}
transition={
  marker.blink
    ? {
        duration: 2,           // Vitesse (2 secondes)
        repeat: Infinity,
        ease: "easeInOut",
      }
    : {}
}
```

### Changer les couleurs

- **Villes visitées** : `markerColor = "#ec4899"` (pink)
- **Villes wishlist** : Ajoute une prop `wishlistColor` pour différencier

## 📊 Structure de la base de données

```sql
cities
├── id (UUID)
├── user_id (UUID) → auth.users
├── name (VARCHAR)
├── country (VARCHAR)
├── latitude (DECIMAL)
├── longitude (DECIMAL)
├── status (ENUM: visited, wishlist)
├── visit_date (DATE)
├── notes (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🔒 Sécurité

- **RLS activé** : Les utilisateurs ne voient que leurs propres villes
- **Policies** : CRUD complet pour l'utilisateur propriétaire
- **Contraintes** : Une ville ne peut être ajoutée qu'une fois par utilisateur

## 🚀 Exemple d'utilisation SQL

### Ajouter une ville visitée
```sql
INSERT INTO cities (user_id, name, country, latitude, longitude, status, visit_date)
VALUES (
  'YOUR_USER_ID',
  'London',
  'United Kingdom',
  51.5074,
  -0.1278,
  'visited',
  '2024-12-01'
);
```

### Ajouter une ville wishlist
```sql
INSERT INTO cities (user_id, name, country, latitude, longitude, status)
VALUES (
  'YOUR_USER_ID',
  'Kyoto',
  'Japan',
  35.0116,
  135.7681,
  'wishlist'
);
```

### Marquer une ville comme visitée
```sql
UPDATE cities
SET
  status = 'visited',
  visit_date = '2024-12-11',
  updated_at = NOW()
WHERE id = 'CITY_ID' AND user_id = 'YOUR_USER_ID';
```

## 💡 Idées futures

- 🗺️ **Filtres par continent**
- 📸 **Galerie photos par ville**
- ✈️ **Calcul de distance parcourue**
- 🏆 **Badges (10 pays visités, etc.)**
- 📅 **Timeline des voyages**
- 🌐 **Carte interactive (zoom, pan)**

---

**Status actuel** : ✅ Base fonctionnelle avec Tokyo clignotant
**Prochaine étape** : Interface de gestion dans Settings
