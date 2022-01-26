const { DataTypes } = require('sequelize');
const sequelize = require('./sequalize');
const RepresentativeApplication = sequelize.define('representative_requests', {
    official: {
      type: DataTypes.JSON,
      allowNull: false
    },
    office: {
      type: DataTypes.JSON,
      allowNull: false
    },
    divisions: {
      type: DataTypes.JSON,
      allowNull: false
    },
    divisionId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    searchTerm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verified: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, { updatedAt: true, createdAt: true, initialAutoIncrement: false });

  module.exports = { RepresentativeApplication };