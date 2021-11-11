const { DataTypes } = require('sequelize');
const sequelize = require('./sequalize');
const RepresentativeApplication = sequelize.define('representative_requests', {
    // Model attributes are defined here
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
    deleted:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    searchTerm: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, { updatedAt: false, createdAt: false, initialAutoIncrement: false });

  module.exports = { RepresentativeApplication };