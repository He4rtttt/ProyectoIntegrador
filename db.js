// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',   // Cambia a tu host si es necesario
  user: 'root',  // Tu usuario de MySQL
  password: 'dangel1330',  // Tu contraseña de MySQL
  database: 'proyecto'  // El nombre de la base de datos
}).promise();

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = connection;
