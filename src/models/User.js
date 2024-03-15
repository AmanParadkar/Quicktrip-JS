import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';
import Package from './Package.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
   
  },
});




export default User;