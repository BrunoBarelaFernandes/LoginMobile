const express = require('express');
const router = express.Router();

module.exports = (bd, verificarAcesso, limiter) => {

  router.post('/', verificarAcesso, limiter, async (req, res) => {
    const { operacao, tabela, id } = req.body;

    try {
     const Acessos = await bd.findIndice("Acessos", tabela, "tabela");
     const c = Acessos.length > 0 ? Acessos[0] : null;

      if (!c || !(parseInt(req.usuarioLogado.permissao) >= parseInt(c.NA)) || !(parseInt(c.NA) == 1)) {
        console.log(`[ALERTA] Tentativa de burlar acesso à coleção: ${tabela}`);
        return res.status(403).json({ dados: "Acesso Negado", autenticacao: false });
      }

      
      if (operacao == "consultar") {
         const item = await bd.findById(c.tabela, id);
        if (item) {
          return res.json({ resposta: true, dados: item, autenticacao: true });
        } else {
          return res.status(404).json({ resposta: false, dados: "Não encontrado", autenticacao: true });
        }
      }
      else if (operacao == "listar") {
        const lista = await bd.findAll(c.tabela);
        return res.json({ resposta: true, dados: lista, autenticacao: true });
      }
      else {
        return res.status(404).json({ resposta: false, dados: "Operação inválida", autenticacao: true });
      }

    } catch (e) {
      console.error("Erro na rota cliente:", e);
      return res.status(500).json({ resposta: false, dados: null, autenticacao: false });
    }
  });

  return router;
};