# Site Web Portfolio Statique

Ce projet est un site web statique qui présente des projets personnels. Les projets sont gérés via des fichiers Markdown et le site est déployé automatiquement via GitHub Actions.

## Fonctionnalités

- Affichage des projets sur la page d'accueil avec des étiquettes de catégories
- Filtrage des projets par catégorie
- Pages de détail générées à partir de fichiers Markdown
- Déploiement automatique via GitHub Actions

## Structure du projet

```
├── .github/
│   ├── workflows/
│   │   └── deploy.yml       # Configuration GitHub Actions
│   └── scripts/
│       └── build.js         # Script de génération du site
├── css/
│   └── style.css           # Styles du site
├── images/                 # Images des projets
├── js/
│   └── main.js             # Scripts JavaScript
├── projets/
│   ├── index.json          # Liste des projets pour la page d'accueil
│   └── *.md                # Fichiers Markdown des projets
├── templates/
│   └── project.html        # Template pour les pages de projet
├── .gitignore              # Fichiers à ignorer par Git
├── index.html              # Page d'accueil
├── package.json            # Configuration npm
└── README.md               # Documentation
```

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Un compte GitHub pour le déploiement automatique

## Installation et développement local

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-nom/site-web-portfolio.git
   cd site-web-portfolio
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

4. Ouvrez votre navigateur à l'adresse http://localhost:3000

## Ajout d'un nouveau projet

1. Créez un nouveau fichier Markdown dans le dossier `projets/` avec l'extension `.md`
2. Ajoutez le front matter au début du fichier :
   ```markdown
   ---
   title: Titre du projet
   description: Description courte du projet
   image: ../images/nom-image.jpg
   date: YYYY-MM-DD
   categories: [Catégorie1, Catégorie2]
   ---

   # Contenu du projet en Markdown
   ```

3. Ajoutez l'image du projet dans le dossier `images/`
4. Générez le site avec `npm run build` pour voir les changements

## Déploiement

### Configuration GitHub Actions

Pour déployer automatiquement le site sur votre serveur d'hébergement, vous devez configurer les secrets GitHub suivants :

1. Dans votre dépôt GitHub, allez dans Settings > Secrets and variables > Actions
2. Ajoutez les secrets suivants :
   - `FTP_SERVER` : l'adresse de votre serveur FTP
   - `FTP_USERNAME` : votre nom d'utilisateur FTP
   - `FTP_PASSWORD` : votre mot de passe FTP
   - `FTP_SERVER_DIR` : le répertoire de destination sur le serveur

### Déploiement manuel

Si vous préférez déployer manuellement :

1. Générez le site :
   ```bash
   npm run build
   ```

2. Le site généré se trouve dans le dossier `_site/`
3. Transférez le contenu de ce dossier sur votre serveur d'hébergement

## Personnalisation

### Modification du design

- Modifiez le fichier `css/style.css` pour changer l'apparence du site
- Modifiez le fichier `templates/project.html` pour changer la structure des pages de projet

### Modification de la page d'accueil

- Modifiez le fichier `index.html` pour changer la structure de la page d'accueil

### Modification des catégories

- Ajoutez ou modifiez les boutons de filtrage dans le fichier `index.html`
- Ajoutez les styles correspondants dans `css/style.css`

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.