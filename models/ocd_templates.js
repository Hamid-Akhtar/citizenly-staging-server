const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_URL);
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