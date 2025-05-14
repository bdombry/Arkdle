// sol.js
require('dotenv').config({ path: '../.env.local' });  // ajuste le chemin si besoin
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [result] = await conn.execute(
      `UPDATE dinosaures
       SET deplacement = 'Sol'`
    );
    console.log(`✅ ${result.affectedRows} lignes mises à jour.`);
    await conn.end();
  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour :', err.message);
    process.exit(1);
  }
})();
