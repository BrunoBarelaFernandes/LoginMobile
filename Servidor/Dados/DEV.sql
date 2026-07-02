-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Tempo de geração: 02/07/2026 às 19:23
-- Versão do servidor: 11.8.7-MariaDB-ubu2404
-- Versão do PHP: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `DEV`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `Acessos`
--

CREATE TABLE `Acessos` (
  `tabela` varchar(2000) NOT NULL,
  `NA` varchar(2000) NOT NULL,
  `data` varchar(2000) NOT NULL,
  `id` int(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `Acessos`
--

INSERT INTO `Acessos` (`tabela`, `NA`, `data`, `id`) VALUES
('clientes', '3', '00/00/0000', 1),
('usuarios', '5', '00/00/0000', 2),
('Acessos', '5', '00/00/0000', 3),
('doces', '1', '00/00/0000', 4),
('salgados', '1', '00/00/0000', 5);

-- --------------------------------------------------------

--
-- Estrutura para tabela `clientes`
--

CREATE TABLE `clientes` (
  `nome` varchar(2000) NOT NULL,
  `email` varchar(2000) NOT NULL,
  `data` varchar(2000) NOT NULL,
  `id` int(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `doces`
--

CREATE TABLE `doces` (
  `titulo` varchar(2000) NOT NULL,
  `ingredientes` varchar(2000) NOT NULL,
  `receita` varchar(2000) NOT NULL,
  `data` varchar(2000) NOT NULL,
  `id` int(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `salgados`
--

CREATE TABLE `salgados` (
  `titulo` varchar(2000) NOT NULL,
  `ingredientes` varchar(2000) NOT NULL,
  `receita` varchar(2000) NOT NULL,
  `data` varchar(2000) NOT NULL,
  `id` int(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `salgados`
--

INSERT INTO `salgados` (`titulo`, `ingredientes`, `receita`, `data`, `id`) VALUES
('Lasanha Vegetariana', 'asdasdasdafde', 'wewrfwecadc', '00/00/0000', 1),
('Panqueca Vegetariana', 'asdasdasdafde', 'wewrfwecadc', '00/00/0000', 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `user` varchar(2000) NOT NULL,
  `nome` varchar(2000) NOT NULL,
  `email` varchar(2000) NOT NULL,
  `senha` varchar(2000) NOT NULL,
  `NA` varchar(2000) NOT NULL,
  `data` varchar(2000) NOT NULL,
  `id` int(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`user`, `nome`, `email`, `senha`, `NA`, `data`, `id`) VALUES
('Bruno', 'Bruno Barela Fernandes', 'email@gmail.com', '0000', '5', '00/00/0000', 1),
('Fernando', 'Fernando Teste', 'email@gmail.com', '0000', '3', '00/00/0000', 2),
('TESTE', 'Bruno', 'email@hotmail.com', '123', '2', '23/03/2026', 12);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `Acessos`
--
ALTER TABLE `Acessos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `doces`
--
ALTER TABLE `doces`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `salgados`
--
ALTER TABLE `salgados`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `Acessos`
--
ALTER TABLE `Acessos`
  MODIFY `id` int(13) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(13) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `doces`
--
ALTER TABLE `doces`
  MODIFY `id` int(13) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `salgados`
--
ALTER TABLE `salgados`
  MODIFY `id` int(13) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(13) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
