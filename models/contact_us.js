
const { DataTypes } = require('sequelize');
const sequelize = require('./sequalize');
const ContactUs = sequelize.define('contact_us', {
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
        allowNull: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, { updatedAt: false, createdAt: false, initialAutoIncrement: false });

module.exports = { ContactUs };