
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