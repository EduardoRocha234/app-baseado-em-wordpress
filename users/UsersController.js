const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs/dist/bcrypt");
const crypPassword = require("./genHashFunction");

router.get("/admin/users", (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", {users: users});
  });
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.get("/admin/user/edit/:id", (req, res) => {
  const id = req.params.id;

  User.findByPk(id).then((user) => {
    res.render("admin/users/edit", {user: user});
  });
});

router.post("/users/create", (req, res) => {
  const email = req.body.email;
  const password = crypPassword(req.body.password);

  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    // verifica se não encontra nenhum email no banco, se não houver ai sim o usuario é criado
    if (user === undefined) {
      User.create({
        email: email,
        password: password,
      })
        .then(() => {
          res.redirect("/admin/users");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/");
        });
    } else {
      res.redirect("/admin/users/create");
    }
  });
});

router.post("/user/update", (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const password = crypPassword(req.body.password);

  User.update(
    {email: email, password: password},
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/admin/users");
  });
});

router.post("/user/delete", (req, res) => {
  const id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      User.destroy({
        //? Deleta um usuario pelo id
        where: {id: id},
      }).then(() => {
        res.redirect("/admin/users");
      });
    } else {
      //! NÃO FOR NUMERO
      res.redirect("/admin/users");
    }
  } else {
    //! FOR NULLO
    res.redirect("/admin/users");
  }
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({where: {email: email}}).then(user => {
    //? verifica se encontrou algum usuario com aquele email
    if(user != undefined) {
      //? valida a senha
      const isCorrect = bcrypt.compareSync(password, user.password);
       
      if(isCorrect) {
        //? cria uma sessão
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect('/admin/articles')
      } else {
        res.redirect('/login')
      }
    } else {
      res.redirect('/login')
    }
  })
});

router.get('/logout', (req, res) => {
  req.session.user = undefined
  res.redirect('/')
})

module.exports = router;
