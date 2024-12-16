module.exports = (sequelize, DataTypes) => {
    const Proveedor = sequelize.define('Proveedor', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contacto: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
    });

    Proveedor.associate = (models) => {
        Proveedor.hasMany(models.Producto, {
            foreignKey: 'proveedor_id',
            as: 'productos',
        });
    };

    return Proveedor;
};
