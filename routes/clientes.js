const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.obtenerClientes); // Obtener todos los clientes o buscar por CI
router.get('/:id', clienteController.obtenerCliente); // Obtener un cliente por ID
router.post('/', clienteController.crearCliente); // Crear un cliente
router.put('/:id', clienteController.actualizarCliente); // Actualizar un cliente
router.delete('/:id', clienteController.eliminarCliente); // Eliminar un cliente

module.exports = router;
