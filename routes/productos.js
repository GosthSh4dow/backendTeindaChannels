const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Middleware para servir archivos estáticos (imagenes) desde la carpeta 'uploads'
//router.use('/uploads', express.static('uploads'));

// Rutas CRUD para productos

// Obtener todos los productos
router.get('/', productoController.obtenerProductos);

// Obtener un producto por ID
router.get('/:id', productoController.obtenerProducto);

// Obtener producto por código de barras
router.get('/codigo-barras/:codigo_barras', productoController.obtenerProductoPorCodigoBarras);

// Crear un nuevo producto con imagen
// Usamos express-fileupload para manejar la carga de archivos en el controlador, no en las rutas
router.post('/', productoController.crearProducto);

// Actualizar un producto con imagen
router.put('/:id', productoController.actualizarProducto);

// Eliminar un producto
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;
