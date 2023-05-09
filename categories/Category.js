const Sequelize = require('sequelize');
const connection = require('../database/database')

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//! usar o sync com o force uma vez, se não ele vai tentar criar a tabela toda vez que rodar o projeto
// Category.sync({ force: true })

module.exports = Category