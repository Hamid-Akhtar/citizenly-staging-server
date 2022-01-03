
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
        type: DataTypes.STRING,
        allowNull: false
    },
    line2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
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