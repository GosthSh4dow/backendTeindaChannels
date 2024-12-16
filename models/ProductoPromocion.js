module.exports = (sequelize, DataTypes) => {
    const ProductoPromocion = sequelize.define('ProductoPromocion', {
      id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_promocion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
     
    });
  
    return ProductoPromocion;
  };
  