const Sequelize = require('sequelize');
const connection = require('../database/database')
//? relacionamento entro 2 models
const Category = require('../categories/Category') //? importando model da qual esse vai se relacionar

const Article = connection.define('articles', {
     title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

//* Relacionamento de mão dupla

//? Relacionamento 1 To N usando o metodo hasMany 'tem muitos'
Category.hasMany(Article) //? UMA Categoria tem muitos artigos

//? Relacionamento 1 To 1 usando o metodo belongsTo 'pertence a'
Article.belongsTo(Category) //? UM Artigo pertence a uma categoria

//! usar o sync com o force uma vez, se não ele vai tentar criar a tabela toda vez que rodar o projeto
// Article.sync({ force: true })

module.exports = Article