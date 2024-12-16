
const db = require('../models');
const Usuario = db.Usuario;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Función para manejar el inicio de sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({ error: 'El correo electrónico y la contraseña son obligatorios.' });
        }

        // Buscar el usuario por email
        const usuario = await Usuario.findOne({
            where: { email },
            include: ['sucursal'], // Incluir la sucursal asociada
        });
        console.log('Usuario encontrado:', usuario);
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales inválidas.' });
        }

        // Verificar si el usuario está activado
        if (usuario.estado !== 'activado') {
            return res.status(403).json({ error: 'El usuario está inactivo. Contacta al administrador.' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales inválidas.' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                id_sucursal: usuario.id_sucursal,
            },
            process.env.JWT_SECRET, // Asegúrate de definir esta variable en tu entorno
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                id_sucursal: usuario.id_sucursal,
                sucursal: usuario.sucursal, // Información de la sucursal
            },
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
