const express = require('express');
const router = express.Router()
const Category = require('./Category')
const adminAuth = require("../middlewares/adminAuth");
const slugify = require('slugify'); //? biblioteca para formatar textos para slug por ex: 'Dev Web' ==> 'dev-web'

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => {
    const title = req.body.title

    if(title !== undefined) {

        Category.create({
            title: title,
            slug: slugify(title.toLowerCase())
        }).then(() => {
            res.redirect('/admin/categories')
        })

    } else {
        res.redirect('/admin/categories/new')
    }
})

router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/index', {categories: categories})
    })
})

router.post('/categories/delete', (req, res) => {
    const id = req.body.id

    if(id != undefined) {
        if(!isNaN(id)) {
            
            Category.destroy({ //? Deleta uma categoria pelo id
                where: {id: id},
            }).then(() => {
                res.redirect('/admin/categories')
            })

        } else {//! NÃO FOR NUMERO
            res.redirect('/admin/categories')
    
        }

    } else { //! FOR NULLO
        res.redirect('/admin/categories')
    }
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id

    if(isNaN(id)) res.redirect('/admin/categories')
    
    Category.findByPk(id).then(category => { //? metodo findByPk é um metodo para busca pelo id
        category !== undefined ?  
            res.render('admin/categories/edit', {category: category}) :
            res.redirect('/admin/categories')

    }).catch(err => res.redirect('/admin/categories'))
})

router.post('/categories/update', (req, res) => {
    //? recebe o id e o titulo pelo body
    const id = req.body.id 
    const title = req.body.title

    //? ultiliza a função update do Sequelize
    //* 1 param --> obj com os campos que vão ser alterados juntamente com o valor 
    //* 2 param --> obj com where para localizar onde os dados irão ser atualizados
    Category.update({ title: title, slug: slugify(title.toLowerCase())}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

module.exports = router