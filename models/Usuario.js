// models/Usuario.js
module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rol: {
            type: DataTypes.ENUM('administrador', 'usuario'),
            allowNull: false,
        },
        id_sucursal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Sucursales',
                key: 'id',
            },
        },
        estado: {
            type: DataTypes.ENUM('activado', 'inactivo'),
            allowNull: false,
            defaultValue: 'activado',
        },
        // Nuevos campos para gestionar turnos
        hora_entrada: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        hora_salida: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        turno: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Mañana', // Ejemplo de valor por defecto
        },
    });

    Usuario.associate = (models) => {
        Usuario.belongsTo(models.Sucursal, {
            foreignKey: 'id_sucursal',
            as: 'sucursal',
        });
        Usuario.hasMany(models.Venta, { foreignKey: 'id_usuario', as: 'ventas' });
        Usuario.hasMany(models.Caja, { foreignKey: 'cerrado_por', as: 'cierres' });
        
       
    };

    return Usuario;
};
