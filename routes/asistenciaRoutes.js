// routes/asistenciaRoutes.js
const express = require('express');
const router = express.Router();
const AsistenciaController = require('../controllers/asistenciaController');

router.get('/:usuarioId', AsistenciaController.getAsistenciasByUsuario);
router.put('/:id', AsistenciaController.updateAsistencia);
router.post('/crear', AsistenciaController.crearAsistencia);
router.post('/salida', AsistenciaController.registrarSalida);
module.exports = router;
