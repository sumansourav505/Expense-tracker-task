const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category:{
    type:Sequelize.STRING,
    allowNull:false
  },
  // userId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: 'users',  // Foreign key to the Users table
  //     key: 'id',
  //   },
  // },
  // createdAt: {
  //   type: Sequelize.DATE,
  //   allowNull: false,
  //   defaultValue: Sequelize.NOW,
  // },
  // updatedAt: {
  //   type: Sequelize.DATE,
  //   allowNull: false,
  //   defaultValue: Sequelize.NOW,
  // },
});

module.exports = Expense;
