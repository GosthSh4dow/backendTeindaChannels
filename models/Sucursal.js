// models/sucursal.js
module.exports = (sequelize, DataTypes) => {
    const Sucursal = sequelize.define('Sucursal', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING,
        },
        estado: {
            type: DataTypes.ENUM('activa', 'inactiva'),
            defaultValue: 'activa',
        },
        hwid: {
            type: DataTypes.STRING,
            unique: true,  
            allowNull: false, 
        }
    },
    {
        tableName: 'sucursales', // Nombre explícito de la tabla
        timestamps: true, // Manejo de createdAt y updatedAt
    });
    Sucursal.associate = (models) => {
        Sucursal.hasMany(models.Venta, { foreignKey: 'id_sucursal', as: 'ventas' });
        Sucursal.hasMany(models.Caja, { foreignKey: 'id_sucursal', as: 'cajas' });
    };
    
    return Sucursal;
};
