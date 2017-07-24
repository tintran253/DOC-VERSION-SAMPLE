
var Sequelize = require("sequelize");

const sequelize = new Sequelize('nodeg', 'postgres', 'Trong@123', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;
// Or you can simply use a connection uri
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
