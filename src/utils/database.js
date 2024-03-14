import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('quicktrip', 'postgres', 'aman8878', {
  host: 'localhost',
  dialect: 'postgres',
});

export default sequelize;
