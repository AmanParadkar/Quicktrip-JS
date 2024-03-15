import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';
import User from './User.js';

const Package = sequelize.define('Package', {
  startPoint:{
    type:DataTypes.STRING,
    allowNull:false
  },
  destination:{
    type:DataTypes.STRING,
    allowNull:false
  },
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