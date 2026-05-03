# API de Gestão de Carga Horária Escolar

API RESTful para gerenciamento de carga horária docente em múltiplas instituições de ensino.
Desenvolvida como Trabalho Acadêmico SENAC 2026 para obtenção do Conceito B.

**Stack:** Node.js · TypeScript · Express · TypeORM · MySQL · JWT · bcryptjs

## 🚀 Como rodar o projeto passo a passo

**1. Abra a pasta correta no terminal**
É fundamental que o terminal esteja aberto exatamente na pasta do projeto. No VS Code, vá em `File > Open Folder` e selecione a pasta `calculadora-escolar-backend`. 
Se preferir usar o comando manual no terminal, navegue até a pasta:
```bash
# Exemplo: mudando para o disco E: e entrando na pasta
E:
cd E:\calculadora-escolar-backend
```1. Instale as dependências**
npm install

 2. Preencher o .env com suas credenciais do MySQL
# (edite o arquivo .env na raiz do projeto)

# 3. Criar as tabelas no MySQL
#    Opção A — SQL manual: veja README_BANCO.md
#    Opção B — Migration TypeORM:
---
```2. Prepare o Banco de Dados**
npm run migration:run

```3. Iniciar o servidor**
npm run dev
✅ Banco de dados conectado com sucesso!
🚀 Servidor rodando em http://localhost:3333
--



# 4. Iniciar o servidor
npm run dev
✅ Banco de dados conectado com sucesso!
🚀 Servidor rodando em http://localhost:3333
| Arquivo                                                               | Conteúdo                                                     |
| --------------------------------------------------------------------- | ------------------------------------------------------------ |
| README_NEGOCIO.md                                                     | Problema, solução, regras de negócio e requisitos acadêmicos |
| Diagrama_Projeto.md                                                   | Diagrama SVG das entidades, relacionamentos e fórmulas       |
| README_BANCO.md                                                       | Criação do banco de dados, tabelas e queries úteis           |
| README_TESTES.md                                                      | Guia completo de testes no Insomnia                          |
| insomnia_collection.json\| Collection pronta para importar no Insomnia | 
src/
├── @types/
│   └── express.d.ts               Extensão do tipo Request com user.id
├── controllers/
│   ├── ProfessorController.ts     Recebe requisições HTTP do professor
│   ├── EscolaController.ts        Recebe requisições HTTP da escola
│   └── CargaHorariaController.ts  Recebe requisições HTTP da carga horária
├── services/
│   ├── ProfessorService.ts        Regras de negócio do professor
│   ├── EscolaService.ts           Regras de negócio da escola
│   └── CargaHorariaService.ts     Regras de negócio e cálculos de horas
├── repositories/
│   ├── ProfessorRepository.ts     Acesso ao banco — tabela professores
│   ├── EscolaRepository.ts        Acesso ao banco — tabela escolas
│   └── CargaHorariaRepository.ts  Acesso ao banco — tabela cargas_horarias
├── entities/
│   ├── Professor.ts               Entidade TypeORM — mapeamento da tabela
│   ├── Escola.ts                  Entidade TypeORM — mapeamento da tabela
│   └── CargaHoraria.ts            Entidade TypeORM — mapeamento da tabela
├── middlewares/
│   ├── authMiddleware.ts          Valida o token JWT em rotas protegidas
│   └── errorMiddleware.ts         Tratamento global de erros e exceções
├── errors/
│   └── AppError.ts                Classe de erro customizada com statusCode
├── routes/
│   └── index.ts                   Definição de todos os 15 endpoints
├── database/
│   ├── data-source.ts             Configuração do TypeORM e conexão MySQL
│   └── migrations/
│       └── 1714000000000-CreateAllTables.ts Criação das 3 tabelas
├── app.ts                         Configuração do Express e middlewares
└── server.ts




![Endpoints da API
Públicos (sem autenticação)](image-1.png)
| Método | Endpoint        | Descrição                           |
| ------ | --------------- | ----------------------------------- |
| GET    | /professores/me | Ver dados do professor logado       |
| PUT    | /professores/me | Atualizar nome, e-mail ou senha     |
| DELETE | /professores/me | Excluir a própria conta             |
| POST   | /escolas        | Cadastrar nova escola               |
| GET    | /escolas        | Listar todas as escolas             |
| GET    | /escolas/:id    | Buscar escola por ID                |
| PUT    | /escolas/:id    | Atualizar dados da escola           |
| DELETE | /escolas/:id    | Excluir escola                      |
| POST   | /cargas         | Criar carga horária (calcula horas) |
| GET    | /cargas         | Listar cargas do professor logado   |
| GET    | /cargas/:id     | Buscar carga por ID                 |
| PUT    | /cargas/:id     | Atualizar carga (recalcula horas)   |
| DELETE | /cargas/:id     | Excluir carga horária               |             Inicialização do servidor e validação do .env    



---

##Se ocorrer esse erro : 9 vulnerabilities (2 low, 1 moderate, 6 high)

    

                                            