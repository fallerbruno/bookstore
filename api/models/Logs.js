const { DataTypes, Model } = require('sequelize');
const db = require('../db');

class Logs extends Model { };

Logs.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
}, {
    sequelize: db,
    tableName: 'logs',
    modelName: 'Logs'
  });
  
  module.exports = Logs;