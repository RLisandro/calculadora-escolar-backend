# Guia de Teste Multi-usuário — Calculadora Escolar

Este guia ensina como testar a API simulando diferentes professores, garantindo que cada um veja apenas suas próprias informações e como verificar tudo no banco de dados.

---

## Passo 1: Cadastro dos Professores

No Insomnia, use a rota `POST /register` para cadastrar os professores abaixo.

| Nome | E-mail | Senha |
| :--- | :--- | :--- |
| Lisandro Cazuza | ana@escola.com | senha123 |
| Carlos Mendes | carlos@escola.com | senha123 |
| Lisandro Rezende | lisandro@escola.com | senha123 |

---

## Passo 2: Login e Gerenciamento de Tokens

Para cada professor, você deve fazer o Login (`POST /login`) e copiar o `token` gerado.

### Dica de Organização no Insomnia:
Você pode criar **Ambientes (Environments)** diferentes para cada professor, salvando o token de cada um em uma variável chamada `token`.

### Como saber quem está logado?
Use a rota `GET /professores/me` enviando o token do professor.
- Se enviar o token da **Ana**, a resposta mostrará "Lisandro Cazuza".
- Se enviar o token do **Carlos**, a resposta mostrará "Carlos Mendes".

---

## Passo 3: Criando Carga Horária Individual

Cada professor deve criar sua própria carga horária. **O sistema vinculará automaticamente ao ID do professor logado.**

1.  **Logue como Lisandro Cazuza** (ana@escola.com).
2.  Use a rota `POST /cargas` com estes dados:
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

3.  **Logue como Carlos Mendes** (carlos@escola.com).
4.  Use a rota `POST /cargas` com dados diferentes (ex: 6 períodos).

---

## Passo 4: Visualização Individual

Ao usar a rota `GET /cargas`:
- Se você usar o Token do **Lisandro**, verá apenas as escolas dele.
- Se você usar o Token do **Carlos**, verá apenas as escolas dele.

---

## Passo 5: Verificação no MySQL (Visão Geral)

Para ver "um por um" ou todos juntos no banco de dados, use estas queries:

### Ver todos os professores e suas respectivas cargas:
```sql
SELECT 
    p.nome AS Professor, 
    e.nome AS Escola, 
    ch.totalHoras AS Horas_Anuais
FROM cargas_horarias ch
JOIN professores p ON p.id = ch.professor_id
JOIN escolas e ON e.id = ch.escola_id;
```

### Ver apenas um professor específico (ex: Carlos):
```sql
SELECT p.nome, e.nome, ch.totalHoras
FROM cargas_horarias ch
JOIN professores p ON p.id = ch.professor_id
JOIN escolas e ON e.id = ch.escola_id
WHERE p.nome = 'Carlos Mendes';
```

---

## Resumo de Fluxo para o Testador
1.  **POST /login** -> Recebe o Token.
2.  **GET /professores/me** -> Confirma quem é você.
3.  **POST /cargas** -> Cadastra uma escola para você.
4.  **GET /cargas** -> Vê sua lista de escolas.
5.  **MySQL** -> Confirma se os IDs foram gravados corretamente.
