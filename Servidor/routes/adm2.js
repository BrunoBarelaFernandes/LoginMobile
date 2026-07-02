const express = require('express');
const router = express.Router();

module.exports = (bd, verificarAcesso, limiter) => {

  router.post('/', verificarAcesso, limiter, async (req, res) => {
    const { operacao, tabela, dados } = req.body;

    try {
      const Acessos = await bd.findIndice("Acessos", tabela, "tabela");
      const c = Acessos.length > 0 ? Acessos[0] : null;

      if (!c || 2 >= req.usuarioLogado.permissao || !(parseInt(req.usuarioLogado.permissao) >= parseInt(c.NA))) {
        console.log(`[ALERTA] Tentativa de burlar acesso à coleção administrativa: ${tabela}`);
        return res.status(403).json({ dados: "Acesso Negado", autenticacao: false });
      }


      if (operacao == "add") {
        delete dados.id;
        delete dados._id;
        await bd.create(c.tabela, dados);
        return res.json({ resposta: true, dados: null, autenticacao: true });
      }

      else if (operacao == "editar") {
        const id = dados.id;
        const d = { ...dados };
        delete d.id;
        await bd.update(c.tabela, id, "id", d);
        return res.json({ resposta: true, dados: null, autenticacao: true });
      }

      else if (operacao == "deletar") {
        await bd.delete(c.tabela, dados);
        console.log("DELETAR: "+c.tabela+" "+dados);
        return res.json({ resposta: true, dados: null, autenticacao: true });
      }

      else if (operacao == "consultar") {
       const item = await bd.findById(c.tabela, dados);
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
        return res.status(404).json({ resposta: false, dados: "Operação não reconhecida", autenticacao: true });
      }

    } catch (e) {
      console.error("Erro na rota ADM:", e);
      return res.status(500).json({ resposta: false, dados: null, autenticacao: false });
    }
  });

  return router;
};
