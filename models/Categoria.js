// models/Categoria.js
module.exports = (sequelize, DataTypes) => {
    const Categoria = sequelize.define('Categoria', {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
    });
  
    Categoria.associate = (models) => {
      // Relación con Productos (un producto pertenece a una categoría)
      Categoria.hasMany(models.Producto, {
        foreignKey: 'categoria_id',
        as: 'productos',
      });
    };
  
    return Categoria;
  };
  