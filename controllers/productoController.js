const db = require('../models');
const Producto = db.Producto;
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

// Usamos el middleware de express-fileupload
exports.crearProducto = async (req, res) => {
    try {
        console.log('Body recibido:', req.body);  // Verifica los datos del formulario
        console.log('Archivos recibidos:', req.files); 
        
        if (!req.files || !req.files.imagen) {
            return res.status(400).json({ error: 'La imagen es requerida.' });
        }
        const { nombre, descripcion, costo ,stock, proveedor_id, fecha_caducidad, codigo_barras, precio_venta, categoria_id, id_sucursal } = req.body;


        // Recuperamos la imagen de req.files
        const imagen = req.files.imagen;

        // Generamos un nombre único para la imagen usando la fecha actual y su extensión
        const imagenNombre = Date.now() + path.extname(imagen.name);
        const imagenPath = path.join(__dirname, '..', 'uploads', imagenNombre); // Ruta de destino para la imagen

        // Movemos la imagen a la carpeta uploads
        imagen.mv(imagenPath, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al subir la imagen.' });
            }

            // Verificar si el producto ya existe por código de barras
            const productoExistente = await Producto.findOne({ where: { codigo_barras } });
            if (productoExistente) {
                return res.status(400).json({ error: 'Ya existe un producto con este código de barras.' });
            }

            // Creamos el producto
            const producto = await Producto.create({
                nombre,
                descripcion,
                costo,
                precio_venta,  // Aquí se asigna el valor de precio_venta
                stock,
                proveedor_id,
                fecha_caducidad,
                codigo_barras,
                categoria_id,  // Este campo debe ser incluido
                id_sucursal,   // Este campo también debe ser incluido
                imagen: '/uploads/' + imagenNombre,  // Guardamos la ruta relativa de la imagen
            });

            res.status(201).json({
                message: 'Producto creado correctamente',
                producto,
            });
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

// Obtener todos los productos con sus relaciones (proveedor y promociones)
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [
                {
                    model: db.Proveedor,
                    as: 'proveedor',
                    attributes: ['id', 'nombre', 'contacto', 'email'],
                },
                {
                    model: db.Promocion,
                    as: 'promociones',
                    attributes: ['id', 'tipo', 'descripcion', 'valor', 'fecha_inicio', 'fecha_fin'],
                },
                {
                    model: db.Categoria,
                    as: 'categoria',
                    attributes: ['id','nombre'],
                },
                {
                    model: db.Sucursal,
                    as: 'sucursal',
                    attributes: ['id','nombre','direccion','estado','hwid'],
                },
            ],
        });
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Obtener un producto por ID con sus relaciones
exports.obtenerProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id, {
            include: [
                {
                    model: db.Proveedor,
                    as: 'proveedor',
                    attributes: ['id', 'nombre', 'contacto', 'email'], // Proveedor
                },
                {
                    model: db.Promocion,
                    as: 'promociones',
                    attributes: ['id', 'tipo', 'descripcion', 'valor', 'fecha_inicio', 'fecha_fin'], // Promociones
                },
                {
                    model: db.Categoria,
                    as: 'categoria',
                    attributes: ['id', 'nombre'], // Categoría
                },
                {
                    model: db.Sucursal,
                    as: 'sucursal',
                    attributes: ['id', 'nombre', 'direccion', 'estado', 'hwid'], // Sucursal
                }
            ],
        });
        
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Obtener producto por código de barras
exports.obtenerProductoPorCodigoBarras = async (req, res) => {
    try {
        const producto = await Producto.findOne({
            where: { codigo_barras: req.params.codigo_barras },
            include: [
                {
                    model: db.Proveedor,
                    as: 'proveedor',
                    attributes: ['id', 'nombre', 'contacto', 'email'],
                },
                {
                    model: db.Promocion,
                    as: 'promociones',
                    attributes: ['id', 'tipo', 'descripcion', 'valor', 'fecha_inicio', 'fecha_fin'],
                },
            ],
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener el producto por código de barras:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Actualizar un producto
exports.actualizarProducto = async (req, res) => {
    try {
        // Buscar el producto por su ID
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Extraemos los datos del body de la solicitud
        const { nombre, descripcion, costo, precio_venta, stock, proveedor_id, fecha_caducidad, codigo_barras, categoria_id, id_sucursal } = req.body;

        // Si se sube una nueva imagen, la procesamos
        let imagenUrl = producto.imagen; // Si no se sube una nueva imagen, mantenemos la imagen existente
        if (req.files && req.files.imagen) {
            const imagen = req.files.imagen;
            const imagenNombre = Date.now() + path.extname(imagen.name);
            const imagenPath = path.join(__dirname, '..', 'uploads', imagenNombre);

            // Movemos la imagen a la carpeta de uploads
            imagen.mv(imagenPath, async (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al subir la imagen.' });
                }

                // Actualizamos el producto con los nuevos datos
                await producto.update({
                    nombre,
                    descripcion,
                    costo,
                    precio_venta, // Asignamos el precio de venta
                    stock,
                    proveedor_id,
                    fecha_caducidad,
                    codigo_barras,
                    categoria_id,  // Asegúrate de incluir este campo
                    id_sucursal,   // Asegúrate de incluir este campo
                    imagen: '/uploads/' + imagenNombre,  // Actualizamos la imagen
                });

                res.status(200).json({
                    message: 'Producto actualizado correctamente',
                    producto,
                });
            });
        } else {
            // Si no hay nueva imagen, solo actualizamos los otros campos
            await producto.update({
                nombre,
                descripcion,
                costo,
                precio_venta, // Asignamos el precio de venta
                stock,
                proveedor_id,
                fecha_caducidad,
                codigo_barras,
                categoria_id,  // Asegúrate de incluir este campo
                id_sucursal,   // Asegúrate de incluir este campo
                imagen: imagenUrl, // Mantenemos la imagen existente
            });

            res.status(200).json({
                message: 'Producto actualizado correctamente',
                producto,
            });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.destroy();
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};
