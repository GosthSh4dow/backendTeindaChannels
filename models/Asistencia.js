module.exports = (sequelize, DataTypes) => {
    const Asistencia = sequelize.define('Asistencia', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
        },
        fecha: {
            type: DataTypes.DATEONLY,  // Usamos DATEONLY si solo nos interesa la fecha
            allowNull: false,
        },
        ingreso: {
            type: DataTypes.TIME,  // Cambiado de STRING a TIME
            allowNull: false,
        },
        salida: {
            type: DataTypes.TIME,  // Cambiado de STRING a TIME
            allowNull: true, // Puede ser null si no se ha marcado salida
        },
        estado: {
            type: DataTypes.ENUM('Asistido', 'Falta', 'Reemplazo'),
            allowNull: true,
        },
        justificado: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        reemplazo_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
            allowNull: true,
        },
    });

    Asistencia.associate = (models) => {
        Asistencia.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
        Asistencia.belongsTo(models.Usuario, { foreignKey: 'reemplazo_id', as: 'reemplazo' });
    };

    return Asistencia;
};
