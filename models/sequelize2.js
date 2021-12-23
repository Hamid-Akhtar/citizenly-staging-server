const { Sequelize } = require('sequelize');
const sequelize2 = new Sequelize('ods_db', 'xsean02', 'WasimAnwar$123123', {
    host: 'ozoqodb.cfukutb1nbox.us-west-1.rds.amazonaws.com',
    port: 3306,
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
      max: 2,
      min: 0,
      acquire: 120000, 
      idle: 120000,
      evict: 120000
    },
    dialectOptions: {
        connectTimeout: 60000
      }
});
sequelize2.sync();
module.exports = sequelize2;

