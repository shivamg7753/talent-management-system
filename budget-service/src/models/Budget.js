// src/models/Budget.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Budget = sequelize.define(
  'Budget',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },   // total budget
    spent: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }, // cumulative spend
  },
  { tableName: 'budgets', underscored: true }
);

module.exports = Budget;
