const { Client } = require("pg");
const { PROD_DATABASE_URL } = require('../../config');

const db = new Client(PROD_DATABASE_URL);
db.connect();

console.log("------connection------", db)
console.log("DB Connected!");

module.exports = { db }