const express = require('express')
const app = express()   
const bodyParser = require('body-parser')
const connection = require('./database/database')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')

//* view engine configuration
app.set('view engine', 'ejs')

//* Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//* static
app.use(express.static('public'))

//* database 
connection
    .authenticate()
    .then(() => {
        console.log('Banco conectado!');
    })
    .catch(err => {
        console.log(err);
    })

//* routes

app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories });
        })
    })
})

app.get('/:slug', (req, res) => {
    const slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        // article !== undefined ? res.render('article', {article: article}) : res.redirect('/')
        if(article !== undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories });
            })
        } else {
            res.redirect('/')
        }
    })
    .catch(err => res.redirect('/'))
})

//* listen
app.listen(8080, () => {
    console.log('App rodando na porta 8080...');
})