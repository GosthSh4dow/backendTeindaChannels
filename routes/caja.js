// routes/caja.js
const express = require('express');
const router = express.Router();
const cajaController = require('../controllers/cajaController');

// Ruta para cerrar una caja
router.post('/close', cajaController.cerrarCaja);

// Ruta para abrir una nueva caja
router.post('/open', cajaController.abrirCaja);

// Ruta para obtener el estado actual de la caja
router.get('/status', cajaController.obtenerEstadoCaja);

// Ruta para obtener todas las cajas de una sucursal
router.get('/all', cajaController.obtenerTodasCajas);

// Ruta para obtener las cajas de hoy de una sucursal
router.get('/today', cajaController.obtenerCajasHoy);
router.put('/edit', cajaController.editarCaja);
router.post('/:caja_id/egresos', cajaController.registrarEgreso);


module.exports = router;
