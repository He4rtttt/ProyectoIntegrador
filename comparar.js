const { findByUsername, comparePassword } = require('./models/user');

const login = async (username, enteredPassword) => {
  try {
    // Buscar usuario por nombre de usuario
    const user = await findByUsername(username);
    
    // Si no se encuentra el usuario
    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    // Comparar la contraseña ingresada con el hash almacenado
    const isMatch = await comparePassword(enteredPassword, user.password);

    if (isMatch) {
      return { success: true, message: 'Inicio de sesión exitoso' };
    } else {
      return { success: false, message: 'Contraseña incorrecta' };
    }

  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
};

module.exports = { login };
