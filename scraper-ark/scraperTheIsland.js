require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');

const BASE_URL = 'https://ark.fandom.com/wiki/The_Island#Créatures';

const normalize = str => str
  .normalize('NFD')               // Décompose les accents
  .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
  .replace(/[^\w\s-]/g, '')       // Supprime caractères spéciaux
  .trim()
  .toLowerCase();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);

    const links = $('ul.itemlist li a');

    // On récupère tous les dinos de la BDD pour matcher par préfixe
    const [allDinos] = await conn.execute('SELECT id, nom FROM dinosaures');
    const normalizedDinos = allDinos.map(dino => ({
      id: dino.id,
      nom: dino.nom,
      normPrefix: normalize(dino.nom).slice(0, 5),
    }));

    let count = 0;

    for (let i = 0; i < links.length; i++) {
      const rawName = $(links[i]).text().trim();
      const normPrefix = normalize(rawName).slice(0, 5);

      const match = normalizedDinos.find(d => d.normPrefix === normPrefix);
      if (match) {
        await conn.execute(
          'UPDATE dinosaures SET carte_origine = ? WHERE id = ?',
          ['The Island', match.id]
        );
        console.log(`🟢 ${rawName} → The Island (match avec "${match.nom}")`);
        count++;
      } else {
        console.log(`🔴 ${rawName} non trouvé`);
      }
    }

    await conn.end();
    console.log(`✅ ${count} dinosaures mis à jour avec "The Island"`);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
  }
})();
