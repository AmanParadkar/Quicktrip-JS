import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const State = sequelize.define('State', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  state_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default State;
