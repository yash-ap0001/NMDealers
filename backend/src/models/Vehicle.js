import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dealerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Dealers',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mileage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fuelType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transmission: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bodyStyle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  engineSize: {
    type: DataTypes.STRING,
    allowNull: true
  },
  power: {
    type: DataTypes.STRING,
    allowNull: true
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive', 'sold']]
    }
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  inquiries: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Vehicles',
  timestamps: true
});

export default Vehicle; 