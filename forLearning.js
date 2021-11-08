const sqlite = require('sqlite3');
const config = require('config');
const fs = require('fs');
const dbConfig = config.get('database');
const db = new sqlite.Database(dbConfig.storage);

const test = async () => {};

try {
  fs.copyFileSync(
    `backend/src/database/db/wetter-app-test-copy.db`,
    `backend/src/database/db/wetter-app-test.db`
  );
} catch (error) {
    console.log(error);
}
