// models/user.js
const bcrypt = require('bcryptjs');
const db = require('../db');

// Crear un nuevo usuario
const create = async (username, hashedPassword) => {
  try {
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    return result;
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
    }
  };

// Buscar un usuario por nombre de usuario
const findByUsername = async (username) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log(`Resultados de la búsqueda para "${username}":`, rows); // Verifica los resultados
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    throw error;
  }
};

// Comparar contraseñas
const comparePassword = async (enteredPassword, storedPassword) => {
  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    throw error;
  }
};

// Exportar una sola vez
module.exports = { create, findByUsername, comparePassword };
