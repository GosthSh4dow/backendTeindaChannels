// routes/boletaRoutes.js
const express = require('express');
const router = express.Router();
const BoletaController = require('../controllers/boletaController');

router.get('/', BoletaController.getAllBoletas);
router.post('/', BoletaController.createBoleta);
router.get('/:id', BoletaController.getBoletaById);

module.exports = router;
