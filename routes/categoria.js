// routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Rutas ajustadas para coincidir con los nombres exportados del controlador
router.get('/', categoriaController.getAll);

// Obtener una categoría por ID
router.get('/:id', categoriaController.getById);

// Crear una nueva categoría
router.post('/', categoriaController.create);

// Actualizar una categoría
router.put('/:id', categoriaController.update);

// Eliminar una categoría
router.delete('/:id', categoriaController.delete);

module.exports = router;
