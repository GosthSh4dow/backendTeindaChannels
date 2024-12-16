const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Rutas CRUD para proveedores
router.get('/', proveedorController.obtenerProveedores); // Obtener todos los proveedores
router.get('/:id', proveedorController.obtenerProveedor); // Obtener un proveedor por ID
router.post('/', proveedorController.crearProveedor); // Crear un nuevo proveedor
router.put('/:id', proveedorController.actualizarProveedor); // Actualizar un proveedor
router.delete('/:id', proveedorController.eliminarProveedor); // Eliminar un proveedor

module.exports = router;
