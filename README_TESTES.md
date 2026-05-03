# 🧪 Guia de Testes no Insomnia

**URL base:** `http://localhost:3333`

---

## Como importar a collection no Insomnia

1. Abra o Insomnia
2. Clique em **Import** (ou File → Import)
3. Selecione o arquivo `insomnia_collection.json` que está na raiz do projeto
4. Clique em Scan → Import
5. A collection "Calculadora Escolar API" aparecerá com todas as requisições prontas

---

## Como configurar o Token JWT

Após fazer o login (Parte 2), copie o valor do campo `"token"` da resposta.

Em cada requisição protegida, vá em:
**Auth → Bearer Token → cole o token no campo Token**

---

## Ordem de execução recomendada

Siga sempre esta sequência para evitar erros de dependência entre os dados.

```
Parte 1 → Cadastrar professores
Parte 2 → Fazer login e copiar o token
Parte 3 → Verificar e editar perfil
Parte 4 → Cadastrar escolas
Parte 5 → Criar cargas horárias
Parte 6 → Verificar no MySQL Workbench
Parte 7 → Testar segurança
```

---

## PARTE 1 — Cadastro de Professores (Público)

---

### 1.1 — Cadastrar Professor Ana

| Campo  | Valor                              |
|--------|------------------------------------|
| Método | POST                               |
| URL    | http://localhost:3333/register     |
| Auth   | Nenhuma                            |

Body JSON:
```json
{
    "nome": "Ana Paula Souza",
    "email": "ana@escola.com",
    "senha": "senha123"
}
```

Resposta esperada — 201 Created:
```json
{
    "id": 1,
    "nome": "Ana Paula Souza",
    "email": "ana@escola.com",
    "created_at": "2026-04-22T10:00:00.000Z",
    "updated_at": "2026-04-22T10:00:00.000Z"
}
```

Verificar no MySQL:
```sql
SELECT id, nome, email FROM professores;
```

---

### 1.2 — Cadastrar Segundo Professor

Body JSON:
```json
{
    "nome": "Carlos Mendes",
    "email": "carlos@escola.com",
    "senha": "outrasenha456"
}
```

Resposta esperada — 201 Created com id: 2.

---

### 1.3 — ERRO: E-mail já cadastrado

Body JSON:
```json
{
    "nome": "Outro Nome",
    "email": "ana@escola.com",
    "senha": "qualquersenha"
}
```

Resposta esperada — 409 Conflict:
```json
{
    "status": "error",
    "message": "Este e-mail já está em uso."
}
```

---

## PARTE 2 — Login (Público)

---

### 2.1 — Login com sucesso

| Campo  | Valor                          |
|--------|--------------------------------|
| Método | POST                           |
| URL    | http://localhost:3333/login    |
| Auth   | Nenhuma                        |

Body JSON:
```json
{
    "email": "ana@escola.com",
    "senha": "senha123"
}
```

Resposta esperada — 200 OK:
```json
{
    "professor": {
        "id": 1,
        "nome": "Ana Paula Souza",
        "email": "ana@escola.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> COPIE o valor de "token" e configure em Auth → Bearer Token no Insomnia.
> Todas as requisições das partes seguintes precisam deste token.

---

### 2.2 — ERRO: Senha incorreta

Body JSON:
```json
{
    "email": "ana@escola.com",
    "senha": "senhaerrada"
}
```

Resposta esperada — 401 Unauthorized:
```json
{
    "status": "error",
    "message": "Combinação de e-mail/senha incorreta."
}
```

---

## PARTE 3 — Perfil do Professor (Protegido)

Todas as requisições abaixo precisam do Bearer Token configurado.



### 3.1 — Ver Perfil

| Método | GET                                      |
|--------|------------------------------------------|
| URL    | http://localhost:3333/professores/me     |
| Auth   | Bearer Token                             |

Resposta esperada — 200 OK com os dados do professor logado.

---

### 3.2 — Atualizar Nome

| Método | PUT                                      |
|--------|------------------------------------------|
| URL    | http://localhost:3333/professores/me     |
| Auth   | Bearer Token                             |

Body JSON:
```json
{
    "nome": "Ana Paula Souza Silva"
}
```

Resposta esperada — 200 OK com o nome atualizado.

Verificar no MySQL:
```sql
SELECT nome, updated_at FROM professores WHERE id = 1;
```

---

### 3.3 — ERRO: Atualizar para e-mail já existente

Body JSON:
```json
{
    "email": "carlos@escola.com"
}
```

Resposta esperada — 409 Conflict:
```json
{
    "status": "error",
    "message": "Este e-mail já está em uso."
}
```

---

### 3.4 — Deletar Conta

| Método | DELETE                                   |
|--------|------------------------------------------|
| URL    | http://localhost:3333/professores/me     |
| Auth   | Bearer Token                             |

Resposta esperada — 204 No Content (corpo vazio).

> Após deletar, faça o cadastro e login novamente para continuar os testes.
> O DELETE CASCADE no banco apaga automaticamente todas as cargas do professor.

---

## PARTE 4 — Escola — CRUD Completo (Protegido)

---

### 4.1 — Criar Escola Municipal

| Método | POST                            |
|--------|---------------------------------|
| URL    | http://localhost:3333/escolas   |
| Auth   | Bearer Token                    |

Body JSON:
```json
{
    "nome": "EMEF João Pessoa"
}
```

Resposta esperada — 201 Created:
```json
{
    "id": 1,
    "nome": "EMEF João Pessoa"
}
```

---

### 4.2 — Criar Escola Estadual

Body JSON:
```json
{
    "nome": "Colégio Estadual Tiradentes"
}
```

---

### 4.3 — Criar Escola Privada

Body JSON:
```json
{
    "nome": "Instituto Tecnológico Gaúcho"
}
```

---

### 4.4 — ERRO: Nome duplicado

Body JSON:
```json
{
    "nome": "EMEF João Pessoa"
}
```

Resposta esperada — 409 Conflict:
```json
{
    "status": "error",
    "message": "Já existe uma escola cadastrada com esse nome."
}
```

```

---

### 4.6 — Listar Todas as Escolas

| Método | GET                             |
|--------|---------------------------------|
| URL    | http://localhost:3333/escolas   |
| Auth   | Bearer Token                    |

Resposta esperada — 200 OK com array de escolas ordenadas por nome.

---

### 4.7 — Buscar Escola por ID

| Método | GET                               |
|--------|-----------------------------------|
| URL    | http://localhost:3333/escolas/1   |
| Auth   | Bearer Token                      |

Resposta esperada — 200 OK com os dados da escola.

---

### 4.8 — ERRO: Escola não encontrada

| Método | GET                                 |
|--------|-------------------------------------|
| URL    | http://localhost:3333/escolas/999   |
| Auth   | Bearer Token                        |

Resposta esperada — 404 Not Found:
```json
{
    "status": "error",
    "message": "Escola não encontrada."
}
```

---

### 4.9 — Atualizar Escola

| Método | PUT                               |
|--------|-----------------------------------|
| URL    | http://localhost:3333/escolas/1   |
| Auth   | Bearer Token                      |

Body JSON:
```json
{
    "nome": "EMEF João Pessoa Atualizada"
}
```

Resposta esperada — 200 OK com os dados atualizados.

Verificar no MySQL:
```sql
SELECT nome, updated_at FROM escolas WHERE id = 1;
```

---

### 4.10 — Deletar Escola

| Método | DELETE                            |
|--------|-----------------------------------|
| URL    | http://localhost:3333/escolas/3   |
| Auth   | Bearer Token                      |

Resposta esperada — 204 No Content.

---

## PARTE 5 — Carga Horária — CRUD Completo (Protegido)

Pré-requisito: ter pelo menos duas escolas cadastradas (Parte 4).

---

### 5.1 — Criar Carga Horária na Escola 1

| Método | POST                           |
|--------|--------------------------------|
| URL    | http://localhost:3333/cargas   |
| Auth   | Bearer Token                   |

Body JSON:
```json
{
    "escola_id": 1,
    "periodosSemanais": 4,
    "duracaoPeriodo": 50,
    "semanasTrim1": 12,
    "semanasTrim2": 10,
    "semanasTrim3": 11
}
```

Resposta esperada — 201 Created:
```json
{
    "id": 1,
    "periodosSemanais": 4,
    "duracaoPeriodo": 50,
    "semanasTrim1": 12,
    "semanasTrim2": 10,
    "semanasTrim3": 11,
    "horasSemanal": "3.33",
    "horasTrim1": "40.00",
    "horasTrim2": "33.33",
    "horasTrim3": "36.67",
    "totalHoras": "110.00",
    "professor_id": 1,
    "escola_id": 1,
    "escola": {
        "id": 1,
        "nome": "EMEF João Pessoa",
    }
}
```

> Observe que o sistema calculou automaticamente todas as horas.
> O professor_id foi obtido do token JWT — não é necessário informar.

Verificar no MySQL:
```sql
SELECT ch.id, p.nome AS professor, e.nome AS escola,
       ch.horasSemanal, ch.totalHoras
FROM cargas_horarias ch
JOIN professores p ON p.id = ch.professor_id
JOIN escolas e ON e.id = ch.escola_id;
```

---

### 5.2 — Criar Carga Horária na Escola 2

Body JSON:
```json
{
    "escola_id": 2,
    "periodosSemanais": 6,
    "duracaoPeriodo": 45,
    "semanasTrim1": 11,
    "semanasTrim2": 10,
    "semanasTrim3": 12
}
```

---

### 5.3 — ERRO: Escola inexistente

Body JSON:
```json
{
    "escola_id": 999,
    "periodosSemanais": 4,
    "duracaoPeriodo": 50,
    "semanasTrim1": 12,
    "semanasTrim2": 10,
    "semanasTrim3": 11
}
```

Resposta esperada — 404 Not Found:
```json
{
    "status": "error",
    "message": "Escola não encontrada. Cadastre a escola antes de criar a carga horária."
}
```

---

### 5.4 — ERRO: Períodos inválidos

Body JSON:
```json
{
    "escola_id": 1,
    "periodosSemanais": -1,
    "duracaoPeriodo": 50,
    "semanasTrim1": 12,
    "semanasTrim2": 10,
    "semanasTrim3": 11
}
```

Resposta esperada — 400 Bad Request:
```json
{
    "status": "error",
    "message": "Períodos semanais e duração do período devem ser maiores que zero."
}
```

---

### 5.5 — Listar Minhas Cargas Horárias

| Método | GET                            |
|--------|--------------------------------|
| URL    | http://localhost:3333/cargas   |
| Auth   | Bearer Token                   |

Resposta esperada — 200 OK com a lista de cargas do professor logado,
cada uma incluindo os dados da escola vinculada.

---

### 5.6 — Buscar Carga por ID

| Método | GET                              |
|--------|----------------------------------|
| URL    | http://localhost:3333/cargas/1   |
| Auth   | Bearer Token                     |

Resposta esperada — 200 OK.

---

### 5.7 — Atualizar Carga (horas recalculadas automaticamente)

| Método | PUT                              |
|--------|----------------------------------|
| URL    | http://localhost:3333/cargas/1   |
| Auth   | Bearer Token                     |

Body JSON:
```json
{
    "periodosSemanais": 5,
    "semanasTrim1": 14
}
```

Resposta esperada — 200 OK com os campos horasSemanal, horasTrim1 e
totalHoras recalculados automaticamente.

Verificar no MySQL:
```sql
SELECT periodosSemanais, horasSemanal, horasTrim1, totalHoras, updated_at
FROM cargas_horarias WHERE id = 1;
```

---

### 5.8 — Deletar Carga Horária

| Método | DELETE                           |
|--------|----------------------------------|
| URL    | http://localhost:3333/cargas/1   |
| Auth   | Bearer Token                     |

Resposta esperada — 204 No Content.

---

## PARTE 6 — Verificação Integrada no MySQL

Execute esta query no Workbench para ver o resumo completo de horas por professor:

```sql
SELECT
    p.nome          AS professor,
    COUNT(ch.id)    AS qtd_escolas,
    SUM(ch.totalHoras) AS total_horas_anuais
FROM cargas_horarias ch
JOIN professores p ON p.id = ch.professor_id
GROUP BY p.id, p.nome;
```

Esta query demonstra o sistema funcionando de ponta a ponta, com as três
tabelas integradas e os cálculos corretos.

---

## PARTE 7 — Testes de Segurança

---

### 7.1 — Rota protegida sem token

| Método | GET                            |
|--------|--------------------------------|
| URL    | http://localhost:3333/cargas   |
| Auth   | Nenhuma (remova o token)       |

Resposta esperada — 401 Unauthorized:
```json
{
    "status": "error",
    "message": "Token JWT ausente. Faça login para obter o token."
}
```

---

### 7.2 — Token inválido

| Método | GET                            |
|--------|--------------------------------|
| URL    | http://localhost:3333/cargas   |
| Auth   | Bearer tokenfalso123           |

Resposta esperada — 401 Unauthorized:
```json
{
    "status": "error",
    "message": "Token JWT inválido ou expirado."
}
```

---

### 7.3 — Isolamento de dados entre professores

1. Faça login com carlos@escola.com e copie o token dele
2. Configure esse token no Insomnia
3. Execute GET http://localhost:3333/cargas/1 (que pertence à Ana)

Resposta esperada — 404 Not Found:
```json
{
    "status": "error",
    "message": "Carga horária não encontrada."
}
```

Isso demonstra que cada professor acessa apenas seus próprios dados,
mesmo que saiba o ID do registro de outro professor.

---

## Resumo de todos os endpoints e status codes

| Método | Endpoint              | Auth | Sucesso | Erro principal          |
|--------|-----------------------|------|---------|-------------------------|
| POST   | /register             | Não  | 201     | 400 campos / 409 e-mail |
| POST   | /login                | Não  | 200     | 401 senha errada        |
| GET    | /professores/me       | Sim  | 200     | 401 sem token           |
| PUT    | /professores/me       | Sim  | 200     | 409 e-mail duplicado    |
| DELETE | /professores/me       | Sim  | 204     | 401 sem token           |
| POST   | /escolas              | Sim  | 201     | 400 / 409 nome dup.     |
| GET    | /escolas              | Sim  | 200     | 401 sem token           |
| GET    | /escolas/:id          | Sim  | 200     | 404 não encontrada      |
| PUT    | /escolas/:id          | Sim  | 200     | 404 não encontrada      |
| DELETE | /escolas/:id          | Sim  | 204     | 404 não encontrada      |
| POST   | /cargas               | Sim  | 201     | 400 / 404 escola inv.   |
| GET    | /cargas               | Sim  | 200     | 401 sem token           |
| GET    | /cargas/:id           | Sim  | 200     | 404 não encontrada      |
| PUT    | /cargas/:id           | Sim  | 200     | 404 não encontrada      |
| DELETE | /cargas/:id           | Sim  | 204     | 404 não encontrada      |
