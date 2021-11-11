const { DataTypes } = require('sequelize');
const sequelize = require('./sequalize');
const OcdTemplate =  sequelize.define('ocd_templates', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { updatedAt: false, createdAt: false, initialAutoIncrement: false });

module.exports = { OcdTemplate }