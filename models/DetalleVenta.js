module.exports = (sequelize, DataTypes) => {
    const DetalleVenta = sequelize.define('DetalleVenta', {
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        precio_unitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    });

    DetalleVenta.associate = (models) => {
        DetalleVenta.belongsTo(models.Venta, {
            foreignKey: 'id_venta',
            as: 'venta',
        });
        DetalleVenta.belongsTo(models.Producto, {
            foreignKey: 'id_producto',
            as: 'producto',
        });
    };

    return DetalleVenta;
};
