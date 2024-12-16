const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Rutas CRUD para ventas
router.get('/', ventaController.obtenerVentas); // Obtener todas las ventas
router.get('/:id', ventaController.obtenerVenta); // Obtener una venta por ID
router.post('/', ventaController.crearVenta); // Crear una nueva venta
router.delete('/:id', ventaController.eliminarVenta); // Eliminar una venta

module.exports = router;
