
const { DataTypes } = require('sequelize');
const sequelize = require('./sequalize');
const EarlyMember = sequelize.define('early_members', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    houseNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    streetName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    streetType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direction: {
        type: DataTypes.STRING,
        allowNull: false
    },
    aptNo: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, { updatedAt: false, createdAt: false, initialAutoIncrement: false });

module.exports = { EarlyMember };