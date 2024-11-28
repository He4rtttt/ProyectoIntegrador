const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const booksRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());



app.use('/books', booksRoutes);
app.use('/auth', authRoutes);

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
