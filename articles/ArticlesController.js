const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugfy = require("slugify");

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [{model: Category}], //? Faz o relacionamento com a tebela de categorias, ou seja, desntro dos dados da categoria, vai estar incluso os dados do artigo
  }).then((articles) => {
    res.render("admin/articles/index", {articles: articles});
  });
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", {categories: categories});
  });
});

router.post("/articles/delete", (req, res) => {
  const id = req.body.id;

  if (id !== undefined && !isNaN(id)) {
    //! Validando o id
    Article.destroy({
      where: {id: id},
    }).then(() => {
      res.redirect("/admin/articles");
    });
  } else {
    res.redirect("admin/articles");
  }
});

router.post("/articles/save", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const categoryId = req.body.category;

  Article.create({
    title: title,
    slug: slugfy(title.toLowerCase()),
    body: body,
    categoryId: categoryId,
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

router.get("/admin/articles/edit/:id", (req, res) => {
  const id = req.params.id;

  if (!isNaN(id)) {
    Article.findByPk(id).then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          if (categories != undefined) {
            res.render("admin/articles/edit", {
              article: article,
              categories: categories,
            });
          } else {
            res.redirect("/admin/articles");
          }
        });
      } else {
        res.redirect("/admin/articles");
      }
    });
  } else {
    res.redirect("/admin/articles");
  }
});

router.post("/articles/update", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const body = req.body.body;
  const categoryId = req.body.category;

  if (id !== undefined && !isNaN(id)) {
    Article.update(
      {
        title: title,
        slug: slugfy(title.toLowerCase()),
        body: body,
        categoryId: categoryId,
      },
      {
        where: {
          id: id,
        },
      }
    ).then(() => {
      res.redirect("/admin/articles");
    });
  }
});

router.get("/articles/page/:num", (req, res) => {
  const page = req.params.num;
  let offset = 0; //* define de onde irá começar a contagem

  //? logica da paginação
  isNaN(page) || page == 1 ? (offset = 0) : ((offset = parseInt(page) - 1) * 4);

  Article.findAndCountAll({
    limit: 4, //* limite de dados que irá mostrar
    offset: offset,
    order: [["id", "DESC"]],
  }).then((articles) => {
    let next; //* variavel q irá determinar se tera uma proxima pagina com conteudos

    //* se o offset + a quantidade de dados que terá na página for maior||igual ao total de dados next será false determinando que não terá mais um página a frente
    offset + 4 >= articles.count ? (next = false) : (next = true);

    const result = {
      page: parseInt(page),
      next: next,
      articles: articles,
    };

    Category.findAll().then((categories) => {
      res.render("admin/articles/page", {
        result: result,
        categories: categories,
      });
    });
  });
});

module.exports = router;
