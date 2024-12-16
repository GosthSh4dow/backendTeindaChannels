const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rutas CRUD para usuarios
router.get('/', usuarioController.obtenerUsuarios); // Obtener todos los usuarios
router.get('/:id', usuarioController.obtenerUsuario); // Obtener un usuario por ID
router.post('/', usuarioController.crearUsuario); // Crear un nuevo usuario
router.put('/:id', usuarioController.actualizarUsuario); // Actualizar un usuario
router.delete('/:id', usuarioController.eliminarUsuario); // Eliminar un usuario

module.exports = router;
