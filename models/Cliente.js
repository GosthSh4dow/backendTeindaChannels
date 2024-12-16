module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define(
        'Cliente',
        {
            id_cliente: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nombre_completo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ci: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: 'clientes', // Nombre explícito de la tabla
            timestamps: true, // Manejo de createdAt y updatedAt
        }
    );

    Cliente.associate = (models) => {
        Cliente.hasMany(models.Venta, {
            foreignKey: 'id_cliente',
            as: 'venta',
        });
    };

    return Cliente;
};
