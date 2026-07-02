const mysql = require('mysql2/promise');

class ConexaoSQL {
  constructor(host, user, password, database) {
    if (!ConexaoSQL.instance) {
      this.pool = mysql.createPool({
        host,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      ConexaoSQL.instance = this;
    }
    return ConexaoSQL.instance;
  }

  async query(sql, params) {
    const [results] = await this.pool.execute(sql, params);
    return results;
  }
}

module.exports = ConexaoSQL;