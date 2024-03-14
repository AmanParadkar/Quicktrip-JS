import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const Package = sequelize.define('Package', {
  package_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Package;