const sqlite = require('sqlite3');
const config = require('config');
const dbConfig = config.get('database');
const db = new sqlite.Database(dbConfig.storage);

const test = async () => {};

test();
