// src/models/producto.js

module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    costo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precio_venta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    fecha_caducidad: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    codigo_barras: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Proveedors',
        key: 'id',
      },
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categoria',
        key: 'id',
      },
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sucursales', // Asegúrate de que el nombre del modelo esté correctamente escrito
        key: 'id',
      },
    }
  });

  Producto.associate = (models) => {
    // Relación con Sucursal
    Producto.belongsTo(models.Sucursal, {
      foreignKey: 'id_sucursal',
      as: 'sucursal',
    });

    Producto.belongsTo(models.Proveedor, {
      foreignKey: 'proveedor_id',
      as: 'proveedor',
    });

    Producto.belongsTo(models.Categoria, {
      foreignKey: 'categoria_id',
      as: 'categoria',
    });

    Producto.belongsToMany(models.Promocion, {
      through: models.ProductoPromocion,
      foreignKey: 'id_producto',
      as: 'promociones',
    });
  };

  return Producto;
};
