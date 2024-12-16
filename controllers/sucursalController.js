// controllers/sucursalController.js
const db = require('../models');
const Sucursal = db.Sucursal;

// Obtener todas las sucursales
exports.obtenerSucursales = async (req, res) => {
    try {
        const sucursales = await Sucursal.findAll({
            include: [
                {
                    model: db.Usuario,
                    as: 'usuarios',
                    attributes: ['id', 'nombre', 'email', 'rol', 'estado'],
                },
                {
                    model: db.Producto,
                    as: 'productos',
                    attributes: ['id', 'nombre', 'descripcion', 'precio_venta', 'stock'],
                },
            ],
        });
        res.status(200).json(sucursales);
    } catch (error) {
        console.error('Error al obtener sucursales:', error);
        res.status(500).json({ error: 'Error al obtener sucursales' });
    }
};

// Obtener una sucursal por ID
exports.obtenerSucursal = async (req, res) => {
    try {
        const sucursal = await Sucursal.findByPk(req.params.id, {
            include: [
                {
                    model: db.Usuario,
                    as: 'usuarios',
                    attributes: ['id', 'nombre', 'email', 'rol', 'estado'],
                },
                {
                    model: db.Producto,
                    as: 'productos',
                    attributes: ['id', 'nombre', 'descripcion', 'precio_venta', 'stock'],
                },
            ],
        });
        if (!sucursal) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.status(200).json(sucursal);
    } catch (error) {
        console.error('Error al obtener la sucursal:', error);
        res.status(500).json({ error: 'Error al obtener la sucursal' });
    }
};

// Crear una nueva sucursal
exports.crearSucursal = async (req, res) => {
    try {
        const { hwid, nombre, direccion, estado } = req.body;

        // Validaciones básicas
        if (!hwid || !nombre || !direccion) {
            return res.status(400).json({ error: 'Los campos hwid, nombre y direccion son obligatorios.' });
        }

        // Verificar si el hwid ya existe
        const sucursalExistente = await Sucursal.findOne({ where: { hwid } });
        if (sucursalExistente) {
            return res.status(400).json({ error: 'Ya existe una sucursal con este hwid.' });
        }

        const sucursal = await Sucursal.create({ hwid, nombre, direccion, estado });
        res.status(201).json({
            message: 'Sucursal creada correctamente',
            sucursal,
        });
    } catch (error) {
        console.error('Error al crear sucursal:', error);
        res.status(500).json({ error: 'Error al crear la sucursal' });
    }
};

// Actualizar una sucursal
exports.actualizarSucursal = async (req, res) => {
    try {
        const sucursal = await Sucursal.findByPk(req.params.id);
        if (!sucursal) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }

        const { hwid, nombre, direccion, estado } = req.body;

        // Validaciones básicas
        if (!hwid || !nombre || !direccion) {
            return res.status(400).json({ error: 'Los campos hwid, nombre y direccion son obligatorios.' });
        }

        // Verificar si el nuevo hwid ya existe en otra sucursal
        if (hwid !== sucursal.hwid) {
            const sucursalExistente = await Sucursal.findOne({ where: { hwid } });
            if (sucursalExistente) {
                return res.status(400).json({ error: 'Ya existe una sucursal con este hwid.' });
            }
        }

        await sucursal.update({ hwid, nombre, direccion, estado });
        res.status(200).json({
            message: 'Sucursal actualizada correctamente',
            sucursal,
        });
    } catch (error) {
        console.error('Error al actualizar la sucursal:', error);
        res.status(500).json({ error: 'Error al actualizar la sucursal' });
    }
};

// Eliminar una sucursal
exports.eliminarSucursal = async (req, res) => {
    try {
        const sucursal = await Sucursal.findByPk(req.params.id);
        if (!sucursal) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }

        // Verificar si hay usuarios o productos asociados
        const usuarios = await db.Usuario.findOne({ where: { id_sucursal: sucursal.id } });
        const productos = await db.Producto.findOne({ where: { id_sucursal: sucursal.id } });

        if (usuarios || productos) {
            return res.status(400).json({ error: 'No se puede eliminar la sucursal porque tiene usuarios o productos asociados.' });
        }

        await sucursal.destroy();
        res.status(200).json({ message: 'Sucursal eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar sucursal:', error);
        res.status(500).json({ error: 'Error al eliminar la sucursal' });
    }
};
