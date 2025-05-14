/*
https://ark.fandom.com/wiki/Scorched_Earth
https://ark.fandom.com/wiki/Genesis:_Part_2
https://ark.fandom.com/wiki/Lost_Island
https://ark.fandom.com/wiki/Fjordur
https://ark.fandom.com/wiki/Crystal_Isles
https://ark.fandom.com/wiki/Genesis:_Part_1
https://ark.fandom.com/wiki/Valguero
https://ark.fandom.com/wiki/Extinction
https://ark.fandom.com/wiki/Aberration
https://ark.fandom.com/wiki/Ragnarok
https://ark.fandom.com/wiki/The_Center
*/


require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');

const BASE_URL = 'https://ark.fandom.com/wiki/Aberration'; // À modifier selon le DLC
const DLC_NAME = 'Aberration';

const normalize = str => str
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '') // Supprime accents
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

    const [allDinos] = await conn.execute('SELECT id, nom FROM dinosaures');
    const normalizedDinos = allDinos.map(dino => ({
      id: dino.id,
      nom: dino.nom,
      normPrefix: normalize(dino.nom).slice(0, 5)
    }));

    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);

    const section = $('#Créatures_uniques').parent();
    const ul = section.nextAll('ul.itemlist').first();
    const links = ul.find('a');

    let count = 0;

    for (let i = 0; i < links.length; i++) {
      const rawName = $(links[i]).text().trim();
      const prefix = normalize(rawName).slice(0, 5);

      const match = normalizedDinos.find(d => d.normPrefix === prefix);
      if (match) {
        await conn.execute(
          'UPDATE dinosaures SET carte_origine = ? WHERE id = ?',
          [DLC_NAME, match.id]
        );
        console.log(`🟢 ${rawName} → ${DLC_NAME} (match avec "${match.nom}")`);
        count++;
      } else {
        console.log(`🔴 ${rawName} non trouvé`);
      }
    }

    await conn.end();
    console.log(`✅ ${count} dinos mis à jour pour "${DLC_NAME}"`);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
  }
})();
