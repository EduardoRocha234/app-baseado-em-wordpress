const Sequelize = require('sequelize')

const connection = new Sequelize('guiapress', 'root', '123dev', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00' //? definindo timezone BR
})

module.exports = connection