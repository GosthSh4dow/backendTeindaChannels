const express = require('express');
const router = express.Router();
const {
  obtenerPromociones,
  obtenerPromocion,
  crearPromocion,
  actualizarPromocion,
  eliminarPromocion,
  actualizarPromocionesExpiradas,
  eliminarProductoDePromocion,
} = require('../controllers/promocionController');

// Rutas para las promociones
router.get('/', obtenerPromociones); // Obtener todas las promociones
router.get('/:id', obtenerPromocion); // Obtener una promoción por ID
router.post('/', crearPromocion); // Crear una nueva promoción
router.put('/:id', actualizarPromocion); // Actualizar una promoción existente
router.delete('/:id', eliminarPromocion); // Eliminar una promoción existente
router.put('/expiradas', actualizarPromocionesExpiradas); // Actualizar promociones expiradas
router.delete('/:id/producto/:id_producto', eliminarProductoDePromocion); // Eliminar un producto de una promoción

module.exports = router;
