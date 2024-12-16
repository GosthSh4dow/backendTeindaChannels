// controllers/BoletaController.js
const { Boleta, Usuario } = require('../models');

module.exports = {
    // Obtener todas las boletas
    async getAllBoletas(req, res) {
        try {
            const boletas = await Boleta.findAll({
                include: [{ model: Usuario, as: 'usuario' }],
            });
            res.json(boletas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear una boleta
    async createBoleta(req, res) {
        try {
            const {
                id_usuario,
                monto_turno,
                total,
                asistencias_count,
                faltas_injustificadas,
                faltas_justificadas,
                reemplazos_count,
                turnos_reemplazados,
                fecha_pago,
            } = req.body;

            const boleta = await Boleta.create({
                id_usuario,
                monto_turno,
                total,
                asistencias_count,
                faltas_injustificadas,
                faltas_justificadas,
                reemplazos_count,
                turnos_reemplazados,
                fecha_pago,
            });

            res.status(201).json(boleta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener boleta por ID
    async getBoletaById(req, res) {
        try {
            const boleta = await Boleta.findByPk(req.params.id, {
                include: [{ model: Usuario, as: 'usuario' }],
            });

            if (!boleta) {
                return res.status(404).json({ error: 'Boleta no encontrada' });
            }

            res.json(boleta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
