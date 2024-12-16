const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const db = require('./models'); // Importa los modelos
const clienteRoutes = require('./routes/clientes');
const sucursalRoutes = require('./routes/sucursales');
const usuarioRoutes = require('./routes/usuarios');
const proveedorRoutes = require('./routes/proveedores');
const productoRoutes = require('./routes/productos');
const promocionRoutes = require('./routes/promociones');
const ventaRoutes = require('./routes/ventas');
const authRoutes = require('./routes/auth');
const categoriaRoutes = require('./routes/categoria');
const cajaRoutes = require('./routes/caja');
const boletaRoutes = require('./routes/boleta');
const asistenciaRoutes = require('./routes/asistenciaRoutes');

const router = express.Router();
const fileUpload = require('express-fileupload'); 
// Middleware
app.use(express.json());
// Middleware
app.use(cors({
    origin: '*', // o la URL de tu frontend si es necesario
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
}));
app.use(fileUpload({
    createParentPath: true, // Crea los directorios padres si no existen
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Backend funcionando!');
});

// Sincronización de la base de datos
db.sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
}).catch(err => console.log('Error al sincronizar la base de datos:', err));
app.use('/api/uploads', express.static('uploads'));
app.use('/api/clientes', clienteRoutes);
app.use('/api/sucursales', sucursalRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos',productoRoutes);
app.use('/api/promociones', promocionRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cajas', cajaRoutes);
app.use('/api/boletas', boletaRoutes);
app.use('/api/asistencias', asistenciaRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
