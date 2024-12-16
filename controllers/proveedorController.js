const db = require('../models');
const Proveedor = db.Proveedor;

// Obtener todos los proveedores
exports.obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll({ include: ['productos'] });
        res.status(200).json(proveedores);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
};

// Obtener un proveedor por ID
exports.obtenerProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id, { include: ['productos'] });
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(200).json(proveedor);
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        res.status(500).json({ error: 'Error al obtener el proveedor' });
    }
};

// Crear un nuevo proveedor
exports.crearProveedor = async (req, res) => {
    try {
        const { nombre, contacto, email } = req.body;
        const proveedor = await Proveedor.create({ nombre, contacto, email });
        res.status(201).json(proveedor);
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({ error: 'Error al crear el proveedor' });
    }
};

// Actualizar un proveedor
exports.actualizarProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        const { nombre, contacto, email } = req.body;
        await proveedor.update({ nombre, contacto, email });
        res.status(200).json(proveedor);
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({ error: 'Error al actualizar el proveedor' });
    }
};

// Eliminar un proveedor
exports.eliminarProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        await proveedor.destroy();
        res.status(200).json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({ error: 'Error al eliminar el proveedor' });
    }
};
