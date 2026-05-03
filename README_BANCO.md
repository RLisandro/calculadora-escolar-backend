---
modified: 2026-05-01T17:45:53.672Z
title: 🗄️ Guia de Criação do Banco de Dados — MySQL
---

# 🗄️ Guia de Criação do Banco de Dados — MySQL

Siga este guia na ordem exata. Cada passo depende do anterior.

---

## PASSO 1 — Verificar se o MySQL está rodando

Pressione `Win + R`, digite `services.msc` e clique OK.
Procure MySQL na lista. Se o status não for "Em execução", clique com o botão
direito e selecione Iniciar.

---

## PASSO 2 — Criar o banco de dados

Abra o MySQL Workbench (ou DBeaver) e execute:

```sql
CREATE DATABASE IF NOT EXISTS calculadora_escolar_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE calculadora_escolar_db;
```

---

## PASSO 3 — Criar as tabelas

Copie e execute este script completo no MySQL Workbench:

```sql
USE calculadora_escolar_db;

-- ─────────────────────────────────────────────
-- TABELA 1: professores
-- Armazena os usuários do sistema.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS professores (
    id         INT          AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────
-- TABELA 2: escolas
-- Armazena as instituições de ensino.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS escolas (
    id         INT          AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(255) NOT NULL,

    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────
-- TABELA 3: cargas_horarias
-- Entidade central. Vincula professor + escola.
-- Horas são calculadas automaticamente pelo back-end.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cargas_horarias (
    id               INT           AUTO_INCREMENT PRIMARY KEY,
    periodosSemanais INT           NOT NULL,
    duracaoPeriodo   INT           NOT NULL,
    semanasTrim1     INT           NOT NULL,
    semanasTrim2     INT           NOT NULL,
    semanasTrim3     INT           NOT NULL,
    horasSemanal     DECIMAL(10,2) NOT NULL,
    horasTrim1       DECIMAL(10,2) NOT NULL,
    horasTrim2       DECIMAL(10,2) NOT NULL,
    horasTrim3       DECIMAL(10,2) NOT NULL,
    totalHoras       DECIMAL(10,2) NOT NULL,
    professor_id     INT           NOT NULL,
    escola_id        INT           NOT NULL,
    created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE,
    FOREIGN KEY (escola_id)    REFERENCES escolas(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## PASSO 4 — Configurar o arquivo .env

Na raiz do projeto, abra o arquivo `.env` e preencha com suas credenciais:

```env
PORT=3333

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=SUA_SENHA_DO_MYSQL_AQUI
DB_NAME=calculadora_escolar_db

JWT_SECRET=coloque_uma_chave_secreta_longa_aqui
JWT_EXPIRES_IN=1d
```

---

## PASSO 5 — Instalar dependências e iniciar o servidor

Abra o terminal (PowerShell) dentro da pasta do projeto e execute:

```powershell
# Instalar o pnpm globalmente (só precisa fazer uma vez)
npm install -g pnpm

# Instalar as dependências do projeto
pnpm install

# Iniciar o servidor
pnpm dev
```

Saída esperada no terminal:

```
✅ Banco de dados conectado com sucesso!
🚀 Servidor rodando em http://localhost:3333
```

Se aparecer essa mensagem, o servidor está pronto e conectado ao banco.

---

## PASSO 6 — Verificar as tabelas no MySQL Workbench

Após iniciar o servidor, atualize a conexão no MySQL Workbench.
Expanda o banco `calculadora_escolar_db` e você verá:

```
calculadora_escolar_db
├── Tables
│   ├── cargas_horarias
│   ├── escolas
│   └── professores
```

---

## Comandos SQL para acompanhar os testes no Insomnia

Use estes comandos no MySQL Workbench enquanto testa no Insomnia para ver
as alterações acontecendo em tempo real no banco de dados.

```sql
-- Ver todos os professores cadastrados (sem expor a senha)
SELECT id, nome, email, created_at FROM professores;

-- Ver todas as escolas
SELECT id, nome FROM escolas;

-- Ver cargas horárias com nome da escola e do professor
SELECT
    ch.id,
    p.nome          AS professor,
    e.nome          AS escola,
    ch.periodosSemanais,
    ch.duracaoPeriodo,
    ch.horasSemanal,
    ch.horasTrim1,
    ch.horasTrim2,
    ch.horasTrim3,
    ch.totalHoras,
    ch.created_at
FROM cargas_horarias ch
JOIN professores p ON p.id = ch.professor_id
JOIN escolas     e ON e.id = ch.escola_id
ORDER BY ch.created_at DESC;

-- Ver o total anual de horas por professor
SELECT
    p.nome   AS professor,
    COUNT(ch.id)         AS qtd_escolas,
    SUM(ch.totalHoras)   AS total_horas_anuais
FROM cargas_horarias ch
JOIN professores p ON p.id = ch.professor_id
GROUP BY p.id, p.nome;

-- Limpar todas as tabelas para recomeçar os testes
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE cargas_horarias;
TRUNCATE TABLE escolas;
TRUNCATE TABLE professores;
SET FOREIGN_KEY_CHECKS = 1;
```

---

## Diagrama das Tabelas

```
┌──────────────────┐          ┌─────────────────────────────┐          ┌──────────────────┐
│   professores    │          │       cargas_horarias        │          │     escolas      │
├──────────────────┤          ├─────────────────────────────┤          ├──────────────────┤
│ id  (PK)         │ 1      N │ id  (PK)                    │ N      1 │ id  (PK)         │
│ nome             │◄─────────│ professor_id  (FK)          │─────────►│ nome             │
│ email  (UNIQUE)  │          │ escola_id     (FK)          │          │                  │
│ senha_hash       │          │ periodosSemanais            │          │                  │
│ created_at       │          │ duracaoPeriodo              │          │                  │
│ updated_at       │          │ semanasTrim1 / 2 / 3        │          │      │
└──────────────────┘          │ horasSemanal                │          │ created_at       │
                              │ horasTrim1 / 2 / 3          │          │ updated_at       │
                              │ totalHoras                  │          └──────────────────┘
                              │ created_at / updated_at     │
                              └─────────────────────────────┘
```

---

## Alternativa: rodar as migrations pelo TypeORM

Se preferir não executar o SQL manualmente, use o comando de migration:

```powershell
npm run migration:run
```

O TypeORM criará as três tabelas automaticamente a partir do arquivo
`src/database/migrations/1714000000000-CreateAllTables.ts`.
