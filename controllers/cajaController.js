// controllers/cajaController.js

const db = require('../models');
const { Caja, Usuario, Sucursal } = db;

exports.cerrarCaja = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id_sucursal, cerrado_por, ingresos, egresos, justificacion } = req.body;

        // Validaciones básicas
        if (!id_sucursal || !cerrado_por) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Faltan datos necesarios para cerrar la caja.' });
        }

        // Verificar que la caja esté abierta
        const caja = await Caja.findOne({
            where: { id_sucursal, estado: 'abierta' },
            transaction
        });

        if (!caja) {
            await transaction.rollback();
            return res.status(400).json({ error: 'No hay una caja abierta para esta sucursal.' });
        }

        // Asignar ingresos y egresos
        caja.ingresos = parseFloat(ingresos) || 0.00;
        caja.egresos = parseFloat(egresos) || 0.00;

        // Calcular saldo_final = saldo_inicial + ingresos - egresos
        const saldo_calculado = parseFloat(caja.saldo_inicial) + caja.ingresos - caja.egresos;
        caja.saldo_final = saldo_calculado.toFixed(2);

        // Asignar justificación si egresos > 0
        if (caja.egresos > 0) {
            caja.justificacion = justificacion;
        } else {
            caja.justificacion = null;
        }

        // Actualizar el estado de la caja a 'cerrada'
        caja.estado = 'cerrada';
        caja.cerrado_por = cerrado_por;
        caja.fecha_cierre = new Date();
        await caja.save({ transaction });

        // Generar reporte de cierre (puede ser un PDF o cualquier otro formato)
        const reporte = {
            id_caja: caja.id,
            id_sucursal: caja.id_sucursal,
            fecha: caja.fecha,
            saldo_inicial: caja.saldo_inicial,
            ingresos: caja.ingresos,
            egresos: caja.egresos,
            saldo_final: caja.saldo_final,
            cerrado_por: cerrado_por,
            fecha_cierre: caja.fecha_cierre,
            justificacion: caja.justificacion,
        };

        await transaction.commit();
        res.status(200).json({ message: 'Caja cerrada exitosamente.', reporte });
    } catch (error) {
        if (transaction.finished !== 'commit') {
            await transaction.rollback();
        }
        console.error('Error al cerrar la caja:', error);
        res.status(500).json({ error: 'Error al cerrar la caja.', detalle: error.message });
    }
};

exports.abrirCaja = async (req, res) => {
    console.log('abrir caja ', req.body); 
    const transaction = await db.sequelize.transaction();
    try {
        const { id_sucursal, saldo_inicial, rol } = req.body;

        // Validaciones básicas
        if (!id_sucursal || saldo_inicial === undefined || !rol) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Faltan datos necesarios para abrir la caja.' });
        }

        // Verificar que no haya una caja abierta actualmente
        const cajaAbierta = await Caja.findOne({
            where: { id_sucursal, estado: 'abierta' },
            transaction
        });

        if (cajaAbierta) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Ya existe una caja abierta para esta sucursal.' });
        }

        // Obtener el saldo_final de la última caja cerrada
        const ultimaCaja = await Caja.findOne({
            where: { id_sucursal },
            order: [['createdAt', 'DESC'], ['fecha', 'DESC']],
            transaction
        });

        const saldoInicialCalculado = ultimaCaja ? parseFloat(ultimaCaja.saldo_final) : 0.00;
        const saldoInicialIngresado = parseFloat(saldo_inicial);

        if (rol !== "administrador") {
            // Validar que el saldo inicial ingresado coincida con el saldo final de la última caja
            if (Math.abs(saldoInicialCalculado - saldoInicialIngresado) > 0.01) {
                await transaction.rollback();
                return res.status(400).json({ error: 'El saldo inicial no coincide con el saldo final de la última caja cerrada.' });
            }
        }

        // Crear una nueva caja abierta
        const nuevaCaja = await Caja.create({
            id_sucursal,
            fecha: new Date().toISOString().slice(0, 10),
            saldo_inicial: saldoInicialIngresado,
            ingresos: 0.00,
            egresos: 0.00,
            saldo_final: saldoInicialIngresado.toFixed(2),
            estado: 'abierta',
        }, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Caja abierta exitosamente.', caja: nuevaCaja });
    } catch (error) {
        if (transaction.finished !== 'commit') {
            await transaction.rollback();
        }
        console.error('Error al abrir la caja:', error);
        res.status(500).json({ error: 'Error al abrir la caja.', detalle: error.message });
    }
};

exports.obtenerCajasHoy = async (req, res) => {
    console.log('obtenercajas', req.body); 
    try {
        const { id_sucursal, fecha } = req.query;

        if (!id_sucursal || !fecha) {
            return res.status(400).json({ error: 'Faltan parámetros id_sucursal o fecha.' });
        }

        const cajas = await Caja.findAll({
            where: { id_sucursal, fecha },
            include: [
                {
                    model: Usuario,
                    as: 'usuario_cierre',
                    attributes: ['nombre'],
                },
                {
                    model: Sucursal,
                    as: 'sucursal',
                    attributes: ['nombre', 'direccion'],
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(cajas);
    } catch (error) {
        console.error('Error al obtener cajas del día:', error);
        res.status(500).json({ error: 'Error al obtener cajas del día.', detalle: error.message });
    }
};

exports.obtenerEstadoCaja = async (req, res) => {
    console.log('obtener estado', req.query); 
    try {
        const { id_sucursal } = req.query;

        if (!id_sucursal) {
            return res.status(400).json({ error: 'Se requiere el ID de la sucursal.' });
        }

        const caja = await Caja.findOne({
            where: { id_sucursal },
            order: [['createdAt', 'DESC'], ['fecha', 'DESC']],
            include: [
                {
                    model: Usuario,
                    as: 'usuario_cierre',
                    attributes: ['nombre'],
                },
                {
                    model: Sucursal,
                    as: 'sucursal',
                    attributes: ['nombre', 'direccion'],
                }
            ],
        });

        if (!caja) {
            return res.status(404).json({ error: 'No se encontró ninguna caja para esta sucursal.' });
        }

        res.status(200).json(caja);
    } catch (error) {
        console.error('Error al obtener el estado de la caja:', error);
        res.status(500).json({ error: 'Error al obtener el estado de la caja.', detalle: error.message });
    }
};

// Nueva función para obtener todas las cajas de una sucursal
exports.obtenerTodasCajas = async (req, res) => {
    try {
        const { id_sucursal } = req.query;

        if (!id_sucursal) {
            return res.status(400).json({ error: 'Se requiere el ID de la sucursal.' });
        }

        const cajas = await Caja.findAll({
            where: { id_sucursal },
            include: [
                {
                    model: Usuario,
                    as: 'usuario_cierre',
                    attributes: ['nombre'],
                },
                {
                    model: Sucursal,
                    as: 'sucursal',
                    attributes: ['nombre', 'direccion'],
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(cajas);
    } catch (error) {
        console.error('Error al obtener todas las cajas:', error);
        res.status(500).json({ error: 'Error al obtener todas las cajas.', detalle: error.message });
    }
};
// Nueva función para editar una caja (Solo Administradores)
exports.editarCaja = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id_sucursal, caja_id, saldo_inicial, ingresos, egresos } = req.body;

        // Validaciones básicas
        if (!id_sucursal || !caja_id) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Faltan datos necesarios para editar la caja.' });
        }

        // Verificar que la caja exista y esté abierta
        const caja = await Caja.findOne({
            where: { id: caja_id, id_sucursal },
            transaction
        });

        if (!caja) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Caja no encontrada para esta sucursal.' });
        }

        // Actualizar los campos
        if (saldo_inicial !== undefined) {
            caja.saldo_inicial = parseFloat(saldo_inicial) || caja.saldo_inicial;
        }
        if (ingresos !== undefined) {
            caja.ingresos = parseFloat(ingresos) || caja.ingresos;
        }
        if (egresos !== undefined) {
            caja.egresos = parseFloat(egresos) || caja.egresos;
        }

        // Recalcular saldo_final
        caja.saldo_final = (parseFloat(caja.saldo_inicial) + parseFloat(caja.ingresos) - parseFloat(caja.egresos)).toFixed(2);

        await caja.save({ transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Caja editada exitosamente.', caja });
    } catch (error) {
        if (transaction.finished !== 'commit') {
            await transaction.rollback();
        }
        console.error('Error al editar la caja:', error);
        res.status(500).json({ error: 'Error al editar la caja.', detalle: error.message });
    }
};
exports.registrarEgreso = async (req, res) => {
    const { caja_id } = req.params;
    const { monto } = req.body;

    if (!caja_id) {
        return res.status(400).json({ error: 'Se requiere el ID de la caja.' });
    }

    if (isNaN(monto) || monto <= 0) {
        return res.status(400).json({ error: 'Monto de egreso inválido.' });
    }

    const transaction = await db.sequelize.transaction();
    try {
        const caja = await Caja.findOne({
            where: { id: caja_id, estado: 'abierta' },
            transaction
        });

        if (!caja) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Caja no encontrada o ya está cerrada.' });
        }

        if (monto > parseFloat(caja.saldo_final)) {
            await transaction.rollback();
            return res.status(400).json({ error: 'El monto del egreso excede el saldo disponible.' });
        }

        caja.egresos = parseFloat(caja.egresos) + monto;
        caja.saldo_final = (parseFloat(caja.saldo_inicial) + parseFloat(caja.ingresos) - parseFloat(caja.egresos)).toFixed(2);

        await caja.save({ transaction });
        await transaction.commit();

        res.status(200).json({ message: 'Egreso registrado exitosamente.', egresos: caja.egresos, saldo_final: caja.saldo_final });
    } catch (error) {
        if (transaction.finished !== 'commit') {
            await transaction.rollback();
        }
        console.error('Error al registrar egreso:', error);
        res.status(500).json({ error: 'Error interno al registrar el egreso.' });
    }
};