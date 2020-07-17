const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_tracker"
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("connected as id " + connection.threadId);
    
});

connection.query = util.promisify(connection.query);

module.exports = connection;