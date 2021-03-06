var mysql      = require('mysql');
require('dotenv').config();
var connection = mysql.createConnection({
    host     : process.env.DB_URL,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
