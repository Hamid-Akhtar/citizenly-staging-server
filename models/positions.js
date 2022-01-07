  
const { DataTypes } = require('sequelize');
const sequelize = require('./sequalize');
const Position =  sequelize.define('positions', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name : {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    section : {
      type : DataTypes.STRING,
      allowNull: false
    },
    category: {
      type : DataTypes.STRING,
      allowNull : false
    }
  }, { updatedAt: false, createdAt: false, initialAutoIncrement: false });

module.exports = { Position };