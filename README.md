# Athalie & Co — Site institutionnel

Site statique premium pour **Athalie & Co Business Consulting**, cabinet de conseil en facturation et recouvrement de créances en Belgique. Trilingue (FR / NL / EN).

## Stack

Pure HTML / CSS / JavaScript — pas de build, déployable tel quel sur GitHub Pages.

```
index.html       structure
styles.css       design system (palette logo: noir / or / crème)
i18n.js          dictionnaire FR / NL / EN
script.js        i18n, nav mobile, scroll reveal
assets/          logo + favicon
CNAME            domaine personnalisé
.github/workflows/deploy.yml   déploiement automatique
```

## Aperçu local

Aucun build. Ouvre `index.html` ou sers le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Personnalisation

| Élément | Fichier | Ligne |
|---|---|---|
| Email contact | `index.html` | `mailto:contact@athalieco.be` |
| Téléphone | `index.html` | `tel:+3220000000` |
| Endpoint formulaire | `index.html` | `action="https://formspree.io/f/your-id"` |
| Domaine | `CNAME` | `athalieco.be` |
| Sitemap / robots | `sitemap.xml`, `robots.txt` | URL absolue |

**Formulaire de contact** : crée un compte gratuit sur [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com) ou [Getform](https://getform.io), récupère ton ID, remplace `your-id` dans `index.html`.

---

## Déploiement GitHub Pages

### 1. Pousser le repo

```bash
cd /Users/josuekongolo/Documents/Projects/Ac
git init -b main
git add .
git commit -m "Initial site Athalie & Co"
git remote add origin https://github.com/<ton-user>/<ton-repo>.git
git push -u origin main
```

### 2. Activer GitHub Pages

Sur GitHub → **Settings → Pages** :
- **Source** : *GitHub Actions* (le workflow `.github/workflows/deploy.yml` se déclenche automatiquement)
- À chaque `git push` sur `main`, le site est redéployé en ~30s

URL provisoire : `https://<ton-user>.github.io/<ton-repo>/`

### 3. Domaine personnalisé via Domeneshop

Le fichier `CNAME` contient déjà `athalieco.be` — modifie-le si ton domaine diffère, puis :

**a) DNS chez Domeneshop**

Connecte-toi à [domeneshop.no](https://domeneshop.no) → ton domaine → **DNS**.

Pour un **apex domain** (`athalieco.be`), ajoute 4 enregistrements A pointant vers GitHub Pages :

| Type | Hostname | Valeur          | TTL  |
|------|----------|-----------------|------|
| A    | @        | 185.199.108.153 | 3600 |
| A    | @        | 185.199.109.153 | 3600 |
| A    | @        | 185.199.110.153 | 3600 |
| A    | @        | 185.199.111.153 | 3600 |

Et un CNAME pour le `www` :

| Type  | Hostname | Valeur                          | TTL  |
|-------|----------|---------------------------------|------|
| CNAME | www      | `<ton-user>.github.io.`         | 3600 |

> Si tu préfères ne servir que `www.athalieco.be`, garde uniquement le CNAME `www` et change `CNAME` du repo en `www.athalieco.be`.

**b) Côté GitHub**

- **Settings → Pages → Custom domain** : entre `athalieco.be` → Save
- Coche **Enforce HTTPS** dès que la vérification DNS est validée (peut prendre quelques minutes à quelques heures)

**c) Vérification**

```bash
dig athalieco.be +short      # doit retourner les 4 IP de GitHub
dig www.athalieco.be +short  # doit retourner <ton-user>.github.io
```

---

## i18n

- Langue par défaut : **FR** (marché belge francophone)
- Détection auto : URL `?lang=nl` > localStorage > `navigator.language` > FR
- Persistance via `localStorage` (`athalie.lang`)
- Toggle dans le header (FR / NL / EN)
- Toutes les chaînes sont centralisées dans `i18n.js` — éditer un dictionnaire suffit

## Accessibilité

- HTML sémantique, skip-link, ARIA pour le menu mobile et le toggle langue
- Respect de `prefers-reduced-motion`
- Contrastes WCAG AA sur fonds clair et sombre
- Navigation clavier complète

## SEO

- Open Graph + meta locales (`fr_BE`, `nl_BE`, `en_GB`)
- `hreflang` alternates
- JSON-LD `ProfessionalService`
- `sitemap.xml` + `robots.txt`

## Conformité

- Mentions RGPD dans le formulaire
- Liens placeholder pour la politique de confidentialité, CGV et cookies (à compléter avec le texte légal final)
- Référence à la loi belge du 4 mai 2023 sur le recouvrement amiable B2C
