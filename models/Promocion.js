module.exports = (sequelize, DataTypes) => {
  const Promocion = sequelize.define('Promocion', {
    tipo: {
      type: DataTypes.ENUM('descuento', '2x1'),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Promocion.associate = (models) => {
    Promocion.belongsToMany(models.Producto, {
      through: models.ProductoPromocion,
      foreignKey: 'id_promocion',
      as: 'productos',
    });
  };

  return Promocion;
};
