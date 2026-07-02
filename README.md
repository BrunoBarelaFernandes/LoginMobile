# Layout Admin Panel

Este projeto consiste em uma base para aplicações administrativas desenvolvidas com React Native, Node.js e MySQL (MariaDB).

O foco principal não foi implementar regras de negócio complexas no painel, mas sim desenvolver uma arquitetura reutilizável para autenticação e controle de acesso. Entre as funcionalidades implementadas estão autenticação utilizando JWT, controle de permissões por nível de acesso, persistência de sessão e autenticação biométrica para validar a identidade do usuário ao retornar ao aplicativo.

A API foi desenvolvida especificamente para esse fluxo, oferecendo uma estrutura organizada para autenticação, gerenciamento de sessões e execução de operações protegidas por permissões. Embora o painel contenha apenas funcionalidades demonstrativas, a API foi projetada para suportar diferentes ações administrativas, permitindo sua reutilização como base para novos projetos.

A API está localizada na pasta `Servidor`. Para executá-la, é necessário configurar as variáveis de ambiente, possuir um servidor MySQL/MariaDB em funcionamento e importar a estrutura do banco de dados disponível em `Servidor/Dados`.

## Configuração

Antes de iniciar o projeto, crie um arquivo `.env` na pasta `Servidor` utilizando a estrutura abaixo:

```env
KEYTOKEN="sua_chave_jwt"
CHAVE_ESPERTINHO="sua_chave_api"

HOST_MYSQL="localhost"
USER_MYSQL="seu_usuario"
SENHA_MYSQL="sua_senha"
BD_MYSQL="nome_do_banco"
```

## Executando o servidor

Acesse a pasta `Servidor` e execute:

```bash
npm install
node ServerAPI.js
```

Certifique-se de que não exista nenhum serviço utilizando a porta **3009**.

## Executando o aplicativo

Na raiz do projeto, execute:

```bash
npx expo run:android
```

É necessário possuir um dispositivo Android conectado via ADB ou um emulador Android compatível.

Caso ocorra o erro:

```text
sh: 1: expo: Exec format error
```

execute os comandos abaixo e tente novamente:

```bash
rm -rf node_modules package-lock.json
npm install
npx expo run:android
```
