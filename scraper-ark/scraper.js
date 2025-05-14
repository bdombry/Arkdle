require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');

const BASE_URL = 'https://ark.fandom.com/wiki/Creatures';
const IMG_URL = name => `https://www.dododex.com/media/creature/${name.toLowerCase().replace(/ /g, '-')}.png`;
const convert = val => val.toLowerCase().trim() === 'yes' ? 'oui' : 'non';

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
    const rows = $('table tbody tr');

    for (let i = 0; i < rows.length; i++) {
      const tds = $(rows[i]).find('td');

      if (tds.length < 6) continue; // Skip lignes vides ou incorrectes

      const name = $(tds[0]).text().trim();
      const diet = $(tds[2]).text().trim();
      const tameable = convert($(tds[4]).text());
      const rideable = convert($(tds[5]).text());
      const breedable = convert($(tds[6]).text());

      if (!name || name.startsWith('File:')) continue; // Skip les icônes ou images

      const image = IMG_URL(name);

      const query = `
        INSERT INTO dinosaures (nom, img_url, regime_alimentaire, apprivoisable, montable, carte_origine, type_peau, taille, annee_sortie, type_habitat, deplacement)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const defaultVal = 'inconnue';
      const year = 0;

      await conn.execute(query, [
        name,
        image,
        diet,
        tameable,
        rideable,
        defaultVal,
        defaultVal,
        defaultVal,
        year,
        defaultVal,
        defaultVal
      ]);

      console.log(`✅ Ajouté : ${name}`);
    }

    await conn.end();
    console.log('✅ Scraping terminé !');
  } catch (err) {
    console.error('❌ Erreur :', err.message);
  }
})();
