const express = require('express');
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugfy = require('slugify')

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{ model: Category}] //? Faz o relacionamento com a tebela de categorias, ou seja, desntro dos dados da categoria, vai estar incluso os dados do artigo
    }).then(articles => {
        res.render('admin/articles/index', { articles: articles})
    })
})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', { categories: categories })
    })
})

router.post('/articles/delete', (req, res) => {
    const id = req.body.id
    
    if(id !== undefined && !isNaN(id)) { //! Validando o id
        Article.destroy({
            where: { id: id },
        }).then(() => {
            res.redirect('/admin/articles')
        })
    } else {
        res.redirect('admin/articles')
    }
   
})

router.post('/articles/save', (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const categoryId = req.body.category

    Article.create({
        title: title,
        slug: slugfy(title.toLowerCase()),
        body: body,
        categoryId: categoryId
    }).then(() => {
        res.redirect('/admin/articles')
    })

})

module.exports = router