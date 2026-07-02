const ConexaoSQL = require('./conexaoSQL');

class CRUD {
  constructor(host, user, senha, bd) {
    this.BD = bd;
    this.db = new ConexaoSQL(host, user, senha, bd);
  }


  async status() {
    try {
      await this.db.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async TabelaExiste(tabela) {
    const sql = `SELECT COUNT(*) AS existe FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`;
    const results = await this.db.query(sql, [this.BD, tabela]);
    return results[0].existe;
  }

  async ColunaTabelaExiste(tabela, coluna) {
    const sql = `SELECT COUNT(*) AS existe FROM information_schema.columns WHERE table_schema = ? AND table_name = ? AND COLUMN_NAME = ?`;
    const results = await this.db.query(sql, [this.BD, tabela, coluna]);
    return results[0].existe;
  }


  async CriarTabela(tabela) {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`${tabela}\` (
        \`tabela_id\` INT NOT NULL AUTO_INCREMENT,
        \`id\` VARCHAR(255) NULL,
        \`data\` VARCHAR(2000) NOT NULL,
        \`status\` VARCHAR(2000) NOT NULL,
        PRIMARY KEY (\`tabela_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    return await this.db.query(sql);
  }

  async AddColunaTabela(tabela, nome, tipo, tamanho) {
    // Nomes de tabelas/colunas não podem ser passados via '?', então usamos template strings com backticks
    const sql = `ALTER TABLE \`${tabela}\` ADD \`${nome}\` ${tipo}(${tamanho}) NULL DEFAULT NULL`;
    return await this.db.query(sql);
  }

  async createIndex(tabela, indice, log) {
    const checkIndex = `SHOW INDEX FROM \`${tabela}\` WHERE Key_name = ?`;
    const results = await this.db.query(checkIndex, [indice]);

    if (results.length === 0) {
      const sql = `ALTER TABLE \`${tabela}\` ADD INDEX (\`${indice}\`)`;
      await this.db.query(sql);
      if (log) console.log(`[MySQL] Índice '${indice}' criado.`);
    } else if (log) {
      console.log(`[MySQL] Índice '${indice}' já existe.`);
    }
  }




  async create(tabela, dados) {
    const colunas = Object.keys(dados).map(c => `\`${c}\``).join(', ');
    const placeholders = Object.keys(dados).map(() => '?').join(', ');
    const valores = Object.values(dados);

    const sql = `INSERT INTO \`${tabela}\` (${colunas}) VALUES (${placeholders})`;
    const res = await this.db.query(sql, valores);
    return { insertedId: res.insertId };
  }

  async findAll(tabela) {
    return await this.db.query(`SELECT * FROM \`${tabela}\``);
  }

  async findById(tabela, id) {
    const res = await this.db.query(`SELECT * FROM \`${tabela}\` WHERE \`id\` = ? LIMIT 1`, [id]);
    return res[0] || null;
  }

  async findIndice(tabela, nome, campo) {
    const sql = `SELECT * FROM \`${tabela}\` WHERE \`${campo}\` COLLATE utf8mb4_general_ci LIKE ?`;
    return await this.db.query(sql, [`${nome}%`]);
  }

  async update(tabela, id, chavekey, dados) {
    const setString = Object.keys(dados).map(k => `\`${k}\` = ?`).join(', ');
    const valores = Object.values(dados);
    const sql = `UPDATE \`${tabela}\` SET ${setString} WHERE \`${chavekey}\` = ?`;
    return await this.db.query(sql, [...valores, id]);
  }

  async delete(tabela, id) {
    return await this.db.query(`DELETE FROM \`${tabela}\` WHERE \`id\` = ?`, [id]);
  }
}

module.exports = CRUD;