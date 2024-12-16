// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const db = require('../models');
const Usuario = db.Usuario;

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findByPk(decoded.id, { include: ['sucursal'] });
        if (!usuario) {
            return res.status(401).json({ error: 'No autorizado. Usuario no encontrado.' });
        }

        // Verificar si el usuario está activado
        if (usuario.estado !== 'activado') {
            return res.status(403).json({ error: 'El usuario está inactivo. Contacta al administrador.' });
        }

        // Adjuntar el usuario a la solicitud
        req.user = usuario;
        next();
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error);
        res.status(401).json({ error: 'No autorizado. Token inválido.' });
    }
};
