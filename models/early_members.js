
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
    line1: {
        type: DataTypes.STRING
    },
    line2: {
        type: DataTypes.STRING
    },
    houseNo: {
        type: DataTypes.STRING
    },
    streetName: {
        type: DataTypes.STRING
    },
    streetType: {
        type: DataTypes.STRING
    },
    direction: {
        type: DataTypes.STRING
    },
    aptNo: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    zip: {
        type: DataTypes.STRING
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, { updatedAt: false, createdAt: false, initialAutoIncrement: false });

module.exports = { EarlyMember };