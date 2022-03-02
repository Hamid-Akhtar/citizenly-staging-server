const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('citizenly_staging', 'admin', 'citizenlyadmin', {
  host: 'database-2.cqmtqmjku4aj.us-east-1.rds.amazonaws.com',
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
sequelize.sync();
module.exports = sequelize;

