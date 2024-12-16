const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');

// Rutas CRUD para sucursales
router.get('/', sucursalController.obtenerSucursales); // Obtener todas las sucursales
router.get('/:id', sucursalController.obtenerSucursal); // Obtener una sucursal por ID
router.post('/', sucursalController.crearSucursal); // Crear una nueva sucursal
router.put('/:id', sucursalController.actualizarSucursal); // Actualizar una sucursal
router.delete('/:id', sucursalController.eliminarSucursal); // Eliminar una sucursal

module.exports = router;
