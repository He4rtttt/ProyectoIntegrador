// const bcrypt = require('bcrypt');

// const testPassword = async () => {
//   const password = 'dangel';
//   const hash = '$2a$10$faVzhOVnYg76hzUxcJ7Ry.KpV6kmdeLxzBxWok6JEj518TQUhtsmO';

//   console.log('Contraseña:', password);
//   console.log('Hash:', hash);

//   const isMatch = await bcrypt.compare(password, hash);
//   console.log('¿Las contraseñas coinciden?', isMatch);
// };

// testPassword();

// const bcrypt = require('bcrypt');

// const testHash = async () => {
//   const password = 'mar';
//   const hash = await bcrypt.hash(password, 10);

//   console.log('Nuevo hash generado:', hash);

//   const isMatch = await bcrypt.compare(password, hash);
//   console.log('¿Las contraseñas coinciden?', isMatch);
// };

// testHash();

// const bcrypt = require('bcryptjs');

// const testPassword = async () => {
//   const password = '123456'; // Contraseña ingresada

//   // Generar un nuevo hash para la contraseña
//   const newHash = await bcrypt.hash(password, 10);
//   console.log('Nuevo hash generado:', newHash);

//   // Comparar la contraseña ingresada con el nuevo hash
//   const isMatch = await bcrypt.compare(password, newHash);
//   console.log('¿Las contraseñas coinciden con el nuevo hash?', isMatch);

//   // Comparar la contraseña ingresada con el hash almacenado
//   const storedHash = '$2a$10$0WXWTTf1ebaI85XGAMHhuOZAAZ602HV7zTQInibeYhfQ33feeULBC';
//   const isStoredMatch = await bcrypt.compare(password, storedHash);
//   console.log('¿Las contraseñas coinciden con el hash almacenado?', isStoredMatch);
// };

// testPassword();

const bcrypt = require('bcryptjs');

const testPassword = async () => {
  const password = '123456'; // Contraseña ingresada

  // Generar un nuevo hash para la contraseña
  const newHash = await bcrypt.hash(password, 10);
  console.log('Nuevo hash generado:', newHash);

  // Comparar la contraseña ingresada con el nuevo hash
  const isMatchNewHash = await bcrypt.compare(password, newHash);
  console.log('¿Las contraseñas coinciden con el nuevo hash?', isMatchNewHash);

  // Comparar la contraseña ingresada con el hash almacenado
  const storedHash = '$2a$10$0WXWTTf1ebaI85XGAMHhuOZAAZ602HV7zTQInibeYhfQ33feeULBC';
  const isMatchStoredHash = await bcrypt.compare(password, storedHash);
  console.log('¿Las contraseñas coinciden con el hash almacenado?', isMatchStoredHash);
};

testPassword();