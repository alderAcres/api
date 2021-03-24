// note: .env does not use ""
require("dotenv").config();

// note: if using elephantSQL, goto Details for URL
// https://www.elephantsql.com/docs/nodejs.html
module.exports = {
    PORT: process.env.PORT || 8080,
    PROD: process.env.PROD || 'development',
    PROD_DATABASE_URL: process.env.PROD_DATABASE_URL,
    DEV_DATABASE_URL: 'postgres://localhost:5432/auth_app'
}