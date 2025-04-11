const express = require('express');
const cors = require('cors');  // Ajoute cette ligne pour gérer les requêtes cross-origin
const mysql = require('mysql2');  // Utilise mysql2 pour une meilleure gestion de MySQL
const app = express();
const port = 3001;  // Utilise le port 3001 pour le backend
require('dotenv').config({ path: '.env.local' });



// Configuration de la connexion à la base de données
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.stack);
    return;
  }
  console.log('Connecté à la base de données');
});

// Middleware CORS
app.use(cors());  // Active CORS pour toutes les routes

// Route de test pour vérifier que le backend fonctionne
app.get('/api', (req, res) => {
  res.send('Hello from your API!');
});

// Route pour récupérer les dinosaures
app.get('/api/dinosaures', async (req, res) => {
  try {
    // Exécution de la requête SQL pour récupérer tous les dinosaures
    const [rows] = await connection.promise().query('SELECT * FROM dinosaures');
    res.json(rows);  // Renvoie les résultats sous forme de JSON
  } catch (err) {
    console.error('Erreur lors de la récupération des données:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

// Démarrage du serveur backend
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

app.get('/api/creature-du-jour', async (req, res) => {
  try {
    const [rows] = await connection.promise().query('SELECT * FROM dinosaures');

    const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD
    const hash = Array.from(today).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % rows.length;

    res.json(rows[index]);
  } catch (err) {
    console.error('Erreur lors de la récupération de la créature du jour :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la créature du jour' });
  }
});
