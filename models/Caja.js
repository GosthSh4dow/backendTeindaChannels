// models/caja.js
module.exports = (sequelize, DataTypes) => {
    const Caja = sequelize.define('Caja', {
        id_sucursal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Sucursales',
                key: 'id',
            },
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        saldo_inicial: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        ingresos: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        egresos: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        saldo_final: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        estado: { // Nuevo campo para indicar el estado de la caja
            type: DataTypes.ENUM('abierta', 'cerrada'),
            allowNull: false,
            defaultValue: 'abierta',
        },
        cerrado_por: { // Usuario que cerró la caja
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
        },
        fecha_cierre: { // Fecha y hora del cierre
            type: DataTypes.DATE,
            allowNull: true,
        },
        justificacion: { // Justificación de egresos
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {});

    Caja.associate = (models) => {
        Caja.belongsTo(models.Sucursal, {
            foreignKey: 'id_sucursal',
            as: 'sucursal',
        });
        Caja.belongsTo(models.Usuario, { // Asociación para cerrado_por
            foreignKey: 'cerrado_por',
            as: 'usuario_cierre',
        });
    };

    return Caja;
};
