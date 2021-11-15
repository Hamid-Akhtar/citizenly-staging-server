const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_URL);
sequelize.sync();
module.exports = sequelize;