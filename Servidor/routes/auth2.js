const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

module.exports = (bd, CHAVE_ESPERTINHO) => {

  router.post('/login', async (req, res) => {
    const { chave, usuario, senha } = req.body;
    const SECRET_JWT = process.env.KEYTOKEN;

console.log("=== LOGIN ===");

    if (req.headers['x-api-key'] !== CHAVE_ESPERTINHO) {
      console.log("Acesso Negado");
      return res.status(403).json({ dados: null, autenticacao: false });
    }

    try {
      const usuarios = await bd.findIndice("usuarios", usuario, "user");
      const user = usuarios.length > 0 ? usuarios[0] : null;

      let payload = null;

      if (user && usuario.length > 1) {
        if (user.senha === senha) {
          payload = { id: user.id, user: user.nome, permissao: user.NA };
          console.log(`[Mobile] Login: ${user.user} NA: ${user.NA}`);
        } else {
          return res.status(403).json({ dados: "Senha incorreta", autenticacao: false });
        }
      } else if (usuario.length <= 1) {
        payload = { id: 'publico', user: 'Convidado', permissao: 1 };
        console.log("[Mobile] Login publico");
      } else {
        return res.status(403).json({ dados: "Usuário inexistente", autenticacao: false });
      }

      const token = jwt.sign(payload, SECRET_JWT, { expiresIn: '7d' });

      return res.json({ 
        autenticacao: true, 
        token: token, 
        payload: payload
      });

    } catch (err) {
      console.error("Erro no login Mobile:", err);
      return res.status(500).json({ dados: "Erro interno", autenticacao: false });
    }
  });

  return router;
};