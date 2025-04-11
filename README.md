# Arkdle – Devine le dinosaure du jour ! 🦖

Arkdle est un jeu inspiré de Wordle, version Ark: Survival Evolved.

Chaque jour, une créature différente est sélectionnée. Le joueur doit la deviner à partir de ses caractéristiques : carte d'origine, taille, type de peau, etc.

---

## 📁 Structure du projet

/ ├── frontend/ → Application React (interface du jeu) ├── backend/ → Serveur Express (API + BDD) └── README.md → Ce fichier

yaml
Copier
Modifier

---

## 🚀 Installation rapide

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/arkdle.git
cd arkdle
2. ⚙️ Configurer la base de données
Crée une base de données MySQL / MariaDB nommée ark_wordle

Exécute le script SQL pour créer la table dinosaures et insérer les données

sql


CREATE DATABASE ark_wordle;

USE ark_wordle;

CREATE TABLE dinosaures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255),
  carte_origine VARCHAR(255),
  taille VARCHAR(50),
  type_peau VARCHAR(50),
  annee_sortie INT,
  deplacement VARCHAR(50),
  apprivoisable VARCHAR(10),
  montable VARCHAR(10),
  habitat VARCHAR(50),
  img_url VARCHAR(255)
);

-- Insère quelques dinos
INSERT INTO dinosaures (...) VALUES (...);

3. 🔐 Configurer les variables d’environnement
Dans le dossier backend/ :

Exemple .env (public – modèle)
env

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ark_wordle
DB_PORT=3306
Fichier .env.local (privé – à ne pas versionner)
env

DB_PASSWORD=tonmotdepasse
4. 📦 Installer les dépendances
Backend
bash

cd backend
npm install
Frontend
bash

cd ../frontend
npm install
5. ▶️ Lancer le projet
Backend (port : 3001)
bash

cd backend
npm start
Frontend (port : 3000)
bash

cd ../frontend
npm start
📸 Aperçu
Une capture d’écran stylée du jeu ici !

📦 Stack utilisée
Frontend : React + Bootstrap

Backend : Node.js + Express

Base de données : MariaDB / MySQL

Stockage local : LocalStorage (pour conserver les essais du jour)

🔐 Sécurité
Le fichier .env.local contient vos informations sensibles (mot de passe DB). NE PAS le publier.

Il est déjà ignoré dans le .gitignore.