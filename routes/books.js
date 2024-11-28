const express = require('express');
const db = require('../db'); // Asegúrate de que db sea un PromiseConnection
const fs = require('fs');
const path = require('path');
const { uploadFile, downloadFile } = require('../models/s3');
const router = express.Router();

// Ruta para obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM books');
    res.json(results);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Ruta para obtener un libro por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    if (results.length === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.json(results[0]);
    }
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).json({ error: 'Error fetching book' });
  }
});

// Ruta para crear un nuevo libro
router.post('/', async (req, res) => {
  const { title, author, pages } = req.body;

  if (!title || !author || pages <= 0) {
    return res.status(400).json({ error: 'Please provide valid book data' });
  }

  try {
    // Paso 1: Registrar el libro en la base de datos
    const [result] = await db.query(
      'INSERT INTO books (title, author, pages) VALUES (?, ?, ?)',
      [title, author, pages]
    );

    const book = { id: result.insertId, title, author, pages };

    // Paso 2: Crear un archivo JSON del libro
    const jsonFilePath = path.join(__dirname, `../uploads/book-${book.id}.json`);
    fs.writeFileSync(jsonFilePath, JSON.stringify(book, null, 2));

    // Paso 3: Subir el archivo JSON al bucket en Amazon S3
    const bucketName = process.env.S3_BUCKET_NAME;
    const fileUrl = await uploadFile(jsonFilePath, bucketName);

    // Paso 4: Eliminar el archivo local después de subirlo
    fs.unlinkSync(jsonFilePath);

    // Responder con los datos del libro y la URL del archivo en S3
    res.status(201).json({ book, fileUrl });
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Ruta para actualizar un libro por su ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, pages } = req.body;
  if (!title || !author || pages <= 0) {
    return res.status(400).json({ error: 'Please provide valid book data' });
  }
  try {
    const [result] = await db.query(
      'UPDATE books SET title = ?, author = ?, pages = ? WHERE id = ?',
      [title, author, pages, id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.json({ id, title, author, pages });
    }
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Ruta para eliminar un libro por su ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.status(200).json({ message: 'Book deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Ruta para subir un archivo
router.post('/upload', async (req, res) => {
  const { filePath, bucketName } = req.body;
  try {
    const fileUrl = await uploadFile(filePath, bucketName);
    res.status(201).json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Ruta para descargar un archivo
router.get('/download/:fileName', async (req, res) => {
  const { fileName } = req.params;
  const { bucketName, downloadPath } = req.query;
  try {
    await downloadFile(fileName, bucketName, downloadPath);
    res.status(200).json({ message: 'File downloaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});

module.exports = router;
