module.exports = (sequelize, DataTypes) => {
    const Venta = sequelize.define('Venta', {
        fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        monto_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        id_cliente: { // Añade esta definición
            type: DataTypes.INTEGER,
            allowNull: true, // Permitir null
            references: {
                model: 'Clientes',
                key: 'id_cliente',
            },
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Usuarios',
                key: 'id',
            },
        },
        id_sucursal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Sucursales',
                key: 'id',
            },
        },
    });

    Venta.associate = (models) => {
        Venta.belongsTo(models.Cliente, {
            foreignKey: 'id_cliente',
            as: 'cliente',
        });
    
        Venta.belongsTo(models.Usuario, {
            foreignKey: 'id_usuario',
            as: 'usuario',
        });
        Venta.belongsTo(models.Sucursal, {
            foreignKey: 'id_sucursal',
            as: 'sucursal',
        });
        Venta.hasMany(models.DetalleVenta, {
            foreignKey: 'id_venta',
            as: 'detalles',
        });
    };

    return Venta;
};
