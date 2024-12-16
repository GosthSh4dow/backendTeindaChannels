const { Op } = require('sequelize');
const { Asistencia, Usuario } = require('../models');
const moment = require('moment');

module.exports = {
    // Obtener asistencias por usuario
    async getAsistenciasByUsuario(req, res) {
        try {
            const usuarioId = req.params.usuarioId; // ID del usuario
            
            // Validamos si el ID del usuario es válido
            if (!usuarioId) {
                return res.status(400).json({ error: 'ID de usuario es requerido' });
            }

            // Consulta de las asistencias y reemplazos
            const asistencias = await Asistencia.findAll({
                where: { id_usuario: usuarioId }, // Filtramos por el usuario
                include: [
                    {
                        model: Usuario,
                        as: 'usuario', // Alias de la asociación con el usuario original
                        attributes: ['id', 'nombre'],
                    },
                    {
                        model: Usuario,
                        as: 'reemplazo', // Alias de la asociación con el usuario reemplazo
                        attributes: ['id', 'nombre'],
                    },
                ],
            });

            // Si no se encuentra ninguna asistencia, respondemos con un mensaje adecuado
            if (!asistencias.length) {
                return res.status(404).json({ message: 'No se encontraron asistencias para este usuario.' });
            }

            res.json(asistencias);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener asistencias' });
        }
    },

    // Actualizar una asistencia
    async updateAsistencia(req, res) {
        try {
            const { id } = req.params;
            const asistencia = await Asistencia.findByPk(id);
            if (!asistencia) {
                return res.status(404).json({ error: 'Asistencia no encontrada' });
            }

            const { estado, justificado, reemplazo } = req.body;

            asistencia.estado = estado;
            asistencia.justificado = justificado;
            asistencia.reemplazo_id = reemplazo ? reemplazo : null;

            await asistencia.save();

            res.json(asistencia);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async crearAsistencia(req, res) {
        try {
            const { id_usuario, ingreso, salida, reemplazo_id } = req.body;
            const fechaHoy = moment().format('YYYY-MM-DD'); // Fecha actual
    
            const usuario = await Usuario.findByPk(id_usuario);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            // Obtener la última asistencia registrada para el usuario
            const ultimaAsistencia = await Asistencia.findOne({
                where: {
                    id_usuario,
                },
                order: [['fecha', 'DESC']], // Obtener el último registro de asistencia
            });
    
            let fechaUltimaAsistencia = ultimaAsistencia ? moment(ultimaAsistencia.fecha) : null;
    
            // Si no hay registros anteriores, asignamos una fecha predeterminada (por ejemplo, el 01-01-2024)
            if (!fechaUltimaAsistencia) {
                fechaUltimaAsistencia = moment('2024-01-01');
            }
    
            // Si el último registro es del día de hoy y tiene ingreso pero no salida, no permitimos otro ingreso
            if (ultimaAsistencia && ultimaAsistencia.fecha === fechaHoy && ultimaAsistencia.salida === null) {
                return res.status(400).json({ error: 'Ya marcaste un ingreso hoy, espera a registrar la salida primero' });
            }
    
            // Si el último registro no es del día de hoy, se crea el registro de asistencia para los días faltantes
            if (ultimaAsistencia && !fechaUltimaAsistencia.isSame(fechaHoy, 'day')) {
                let fechaARegistrar = fechaUltimaAsistencia.clone().add(1, 'days'); // Comienza al siguiente día
                while (fechaARegistrar.isBefore(moment(fechaHoy), 'day')) {
                    const diaARegistrar = fechaARegistrar.format('YYYY-MM-DD');
                    
                    const asistenciaExistente = await Asistencia.findOne({
                        where: {
                            id_usuario,
                            fecha: diaARegistrar,
                        }
                    });
    
                    if (!asistenciaExistente) {
                        await Asistencia.create({
                            id_usuario,
                            fecha: diaARegistrar,
                            ingreso: '00:00', // Si no hay registro, se puede poner un valor por defecto
                            salida: '00:00',
                            estado: 'Falta',
                            justificado: null,
                        });
                    }
    
                    fechaARegistrar = fechaARegistrar.add(1, 'days'); // Avanzamos al siguiente día
                }
            }
    
            // Lógica para registrar la falta para el usuario reemplazado si existe un reemplazo
            if (reemplazo_id) {
                // Verificar si ya existe un registro de "Falta" para el usuario reemplazado en la fecha de hoy
                const faltaReemplazo = await Asistencia.findOne({
                    where: {
                        id_usuario: reemplazo_id,
                        fecha: fechaHoy,
                        estado: 'Falta',
                    }
                });
    
                // Si no existe, creamos la falta para el usuario reemplazado
                if (!faltaReemplazo) {
                    await Asistencia.create({
                        id_usuario: reemplazo_id,
                        fecha: fechaHoy,
                        ingreso: '00:00', // El reemplazo no tiene entrada registrada
                        salida: '00:00',  // El reemplazo no tiene salida registrada
                        estado: 'Falta',
                        justificado: null,
                    });
                }
            }
    
            // Registrar la asistencia para el usuario que está realizando el reemplazo
            const asistencia = await Asistencia.create({
                id_usuario,
                fecha: fechaHoy,
                ingreso: ingreso,
                salida: salida || null, // Si no hay salida, se deja como null
                estado: 'Asistido',
                justificado: null,
                reemplazo_id: reemplazo_id || null,
            });
    
            // Devolvemos la respuesta con la asistencia registrada
            res.status(201).json({
                message: 'Asistencia registrada',
                asistencia: {
                    fecha: fechaHoy,
                    ingreso: asistencia.ingreso,
                    salida: asistencia.salida,
                    estado: asistencia.estado,
                    reemplazo: asistencia.reemplazo_id ? 'Sí' : 'No',
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la asistencia' });
        }
    }
    
,    
    async registrarSalida(req, res) {
        try {
            const { id_usuario, salida } = req.body;
            const fechaHoy = moment().format('YYYY-MM-DD'); // Fecha actual

            // Verificar si ya existe un registro de asistencia para el usuario hoy
            const asistenciaHoy = await Asistencia.findOne({
                where: {
                    id_usuario,
                    fecha: fechaHoy,
                    ingreso: { [Op.ne]: null },  // Verificar que el ingreso no sea nulo
                    salida: null,  // Verificar que la salida esté vacía
                },
            });

            // Si no existe una asistencia de ingreso para hoy o ya tiene salida, no se puede registrar
            if (!asistenciaHoy) {
                return res.status(400).json({
                    error: 'No se puede registrar la salida. Asegúrate de haber ingresado hoy y que no haya salido ya.',
                });
            }

            // Actualizar la salida y cambiar el estado a 'Asistido'
            const actualizacion = await asistenciaHoy.update({
                salida: salida, // Registro de la salida
                estado: 'Asistido', // Cambiar el estado a 'Asistido'
            });

            // Devolver la respuesta con los datos actualizados
            res.status(200).json({
                message: 'Salida registrada correctamente',
                asistencia: {
                    fecha: actualizacion.fecha,
                    ingreso: actualizacion.ingreso,
                    salida: actualizacion.salida,
                    estado: actualizacion.estado,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al registrar la salida' });
        }
    }
};
