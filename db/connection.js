const mysql = require('mysql2');
const util = require('util');

require("dotenv").config();

const connection = mysql.createConnection({
    host :'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employees',
    port: 3306
})



module.exports = connection;