const { Categoria } = require('../models'); // Importamos el modelo Categoria

// Crear una nueva categoría
exports.create = async (req, res) => {
    try {
        const { nombre } = req.body;
        
        if (!nombre) {
            return res.status(400).json({ message: "El nombre es obligatorio" });
        }

        const categoriaExistente = await Categoria.findOne({ where: { nombre } });
        if (categoriaExistente) {
            return res.status(400).json({ message: "La categoría ya existe" });
        }

        const nuevaCategoria = await Categoria.create({ nombre });
        return res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear la categoría" });
    }
};

// Obtener todas las categorías
exports.getAll = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        return res.status(200).json(categorias);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener las categorías" });
    }
};

// Obtener una categoría por ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        return res.status(200).json(categoria);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener la categoría" });
    }
};

// Actualizar una categoría
exports.update = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        categoria.nombre = nombre || categoria.nombre;
        await categoria.save();
        return res.status(200).json(categoria);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar la categoría" });
    }
};

// Eliminar una categoría
exports.delete = async (req, res) => {
    const { id } = req.params;
    
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        await categoria.destroy();
        return res.status(200).json({ message: "Categoría eliminada exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar la categoría" });
    }
};
