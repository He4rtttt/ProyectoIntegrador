//routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

// Ruta de registro
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  try {
    const existingUser = await User.findByUsername(trimmedUsername);
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10); // Hash una sola vez
    console.log('Hash generado para la contraseña:', hashedPassword);

    await User.create(trimmedUsername, hashedPassword); // Pasa directamente el hash
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  });

// Ruta de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  console.log('Intento de inicio de sesión para el usuario:', trimmedUsername);

  try {
    const user = await User.findByUsername(trimmedUsername);
    if (!user) {
      console.log('Usuario no encontrado:', trimmedUsername);
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    console.log('Usuario encontrado:', user);
    console.log('Contraseña ingresada:', trimmedPassword);
    console.log('Hash almacenado:', user.password);

    const isMatch = await User.comparePassword(trimmedPassword, user.password);
    console.log('¿Contraseña coincide?', isMatch);
    if (!isMatch) {
      console.log('Contraseña incorrecta para el usuario:', trimmedUsername);
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    console.log('Inicio de sesión exitoso para el usuario:', trimmedUsername);
    res.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;