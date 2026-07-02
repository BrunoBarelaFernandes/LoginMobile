const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bdSQL = require('./CRUD_SQL');
const authRoutes = require('./routes/auth2');
const clienteRoutes = require('./routes/cliente2');
const admRoutes = require('./routes/adm2');

const CHAVE_ESPERTINHO = process.env.CHAVE_ESPERTINHO;

const app = express();

const CRUDSQL = new bdSQL( 
  process.env.HOST_MYSQL,
  process.env.USER_MYSQL,
  process.env.SENHA_MYSQL,
  process.env.BD_MYSQL,
);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { erro: "Muitas requisições." }
});

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const SECRET_JWT = process.env.KEYTOKEN; 

const log = (recebe, envia, next) => {
  envia.on('finish', () => {
    const url = recebe.url;
    const metodo = recebe.method;
    const cod = envia.statusCode;

    if (cod == 200 || cod == 304) {
      console.log(`[Ok] URL: ${url}, Método: ${metodo}, Status: ${cod}`);
    } else {
      console.log(`[!] URL: ${url}, Método: ${metodo}, Status: ${cod}`);
    }
  });
  next();
};

const verificarAcesso = (req, res, next) => {

  const chave = req.headers['x-api-key'];
  const token = req.headers['authorization'];
  

  if (chave !== CHAVE_ESPERTINHO) {
    return res.status(403).json({ erro: "Chave API inválida", autenticacao: false });
  }
  if (!token) {
    return res.status(401).json({ erro: "Token ausente", autenticacao: false });
  }
  try {
    const tokenLimpo = token.replace('Bearer ', '');
    const decodificado = jwt.verify(tokenLimpo, SECRET_JWT);
    req.usuarioLogado = decodificado; 
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Sessão expirada ou inválida", autenticacao: false });
  }
};

app.use(log);

app.use('/', authRoutes(CRUDSQL, CHAVE_ESPERTINHO));
app.use('/api', clienteRoutes(CRUDSQL, verificarAcesso, limiter));
app.use('/adm', admRoutes(CRUDSQL, verificarAcesso, limiter));

app.listen(3009, () => console.log("Servidor na porta 3009"));


//npm install jsonwebtoken


/*
.env 

KEYTOKEN="key123" 
CHAVE_ESPERTINHO="chave_para_desencorajar_curiosos_123"

HOST_MYSQL="localhost"
USER_MYSQL="bruno"
SENHA_MYSQL="1234"
BD_MYSQL="DEV"

*/
