const bcrypt = require("bcryptjs");

const crypPassword = function(password) {
    const salt = bcrypt.genSaltSync(10);
    //? após gerar o salt gero o hash da senha
    const hash = bcrypt.hashSync(password, salt);
    return(hash)
}

module.exports = crypPassword