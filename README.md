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
| Email contact | `index.html` | `mailto:contact@athalieandco.be` |
| Téléphone | `index.html` | `tel:+3220000000` |
| Endpoint formulaire | `index.html` | `action="https://formspree.io/f/your-id"` |
| Domaine | `CNAME` | `athalieandco.be` |
| Sitemap / robots | `sitemap.xml`, `robots.txt` | URL absolue |

**Formulaire de contact** : crée un compte gratuit sur [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com) ou [Getform](https://getform.io), récupère ton ID, remplace `your-id` dans `index.html`.

### Logos clients

La section « Ils nous font confiance » utilise pour l'instant des **wordmarks typographiques** (simple texte stylisé). Pour passer aux vrais logos :

1. Récupère le logo officiel de chaque client (page « Press kit » / « Brand assets » de leur site, ou demande-leur directement).
2. Dépose les fichiers dans `assets/clients/` — formats privilégiés : SVG monochrome (idéal), sinon PNG transparent haute résolution.
3. Dans `index.html`, section `<section class="clients">`, remplace chaque `<span class="client__wordmark">…</span>` par :
   ```html
   <img src="assets/clients/bnp-paribas.svg" alt="BNP Paribas" loading="lazy">
   ```
4. Le CSS gère déjà la hauteur (`max-height: 38px`), le grisage automatique au repos et le retour à la couleur au survol.

⚠️ **Droits** : afficher un logo client implique une relation commerciale. Si tu as réellement travaillé avec ces sociétés, c'est standard en B2B consulting, mais conserve une trace écrite (email, contrat) de leur accord tacite pour éviter toute contestation.

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

### 3. Domaine personnalisé via OVH

Le fichier `CNAME` contient `athalieandco.be`.

**a) Pré-requis OVH**

Sur [ovh.com Manager](https://www.ovh.com/manager/) → ton domaine `athalieandco.be` :

1. Onglet **DNS servers** : assure-toi que le domaine utilise les serveurs DNS d'OVH (`dns112.ovh.net.` / `ns112.ovh.net.` ou similaire). Sinon le DNS Zone n'est pas autoritaire et tes modifications sont ignorées.
2. Onglet **DNS zone** : **supprime** les enregistrements de parking OVH qui pointent vers `213.186.33.5` :
   - `@ A 213.186.33.5`
   - `www A 213.186.33.5`
   - `@ TXT "1|www.athalieandco.be"` (redirection OVH par défaut)
   - `www TXT "3|welcome"` (parking)
3. **Conserve** : tous les `NS`, `SOA`, `MX` (Google Workspace), `SRV`, `_domainkey` (DKIM Mailchimp), `autoconfig`, `autodiscover`, `ftp`.

**b) Ajouter les enregistrements GitHub Pages**

Mode expert OVH (« Add an entry » → format DNS direct, une ligne à la fois) :

```
@ 3600 IN A 185.199.108.153
@ 3600 IN A 185.199.109.153
@ 3600 IN A 185.199.110.153
@ 3600 IN A 185.199.111.153
www 3600 IN CNAME josuekongolo.github.io.
```

Le **point final** après `github.io.` est obligatoire (FQDN).

**c) Côté GitHub**

- **Settings → Pages → Custom domain** : `athalieandco.be` (déjà fait via API)
- Coche **Enforce HTTPS** une fois la vérification DNS validée (5 min à 24h pour le certificat)

**d) Vérification**

```bash
dig athalieandco.be +short      # doit retourner les 4 IP 185.199.108-111.153
dig www.athalieandco.be +short  # doit retourner josuekongolo.github.io.
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
