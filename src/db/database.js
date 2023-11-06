const { Sequelize } = require("sequelize");

const db = new Sequelize('railway', 'root', 'vZANBTEX1fxXsonTB4Na', {
    host: 'containers-us-west-76.railway.app',
    dialect: 'mysql',
    port: 7992
});


module.exports = db;

