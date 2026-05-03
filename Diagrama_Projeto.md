# 📐 Diagrama_Projeto

**API de Gestão de Carga Horária Escolar — SENAC 2026**

---

## Diagrama de Entidades e Relacionamentos

O diagrama abaixo representa todas as entidades do sistema, seus atributos e
os relacionamentos entre elas.

![Diagrama de Entidades](./diagrama_projeto.svg)

> Caso o diagrama não renderize no GitHub, abra o arquivo `diagrama_projeto.svg`
> diretamente no navegador ou em qualquer editor que suporte SVG.

---

## Legenda

| Símbolo | Significado                                     |
|---------|-------------------------------------------------|
| 🔑      | Chave primária — identificador único da entidade |
| 🔗      | Chave estrangeira — referência a outra entidade  |
| ⚡      | Campo calculado automaticamente pelo sistema     |
| `1`     | Lado "um" do relacionamento                      |
| `*`     | Lado "muitos" do relacionamento                  |

---

## Entidades do Sistema

### Professor

Usuário autenticado do sistema. Cada professor possui uma conta protegida por
senha criptografada (bcrypt) e acessa a API por meio de token JWT.

| Campo       | Tipo         | Observação                                    |
|-------------|--------------|-----------------------------------------------|
| 🔑 id       | INT          | Chave primária, auto incremento               |
| nome        | VARCHAR(255) | Nome completo do professor                    |
| email       | VARCHAR(255) | Único no sistema — usado no login             |
| senha_hash  | VARCHAR(255) | Hash bcrypt — nunca retornado nas respostas   |
| created_at  | TIMESTAMP    | Gerado automaticamente na criação             |
| updated_at  | TIMESTAMP    | Atualizado automaticamente a cada alteração   |

---

### Escola

Representa a instituição de ensino vinculada às cargas horárias.

| Campo      | Tipo         | Observação                                          |
|------------|--------------|-----------------------------------------------------|
| 🔑 id      | INT          | Chave primária, auto incremento                     |
| nome       | VARCHAR(255) | Nome único da instituição                           |
| created_at | TIMESTAMP    | Gerado automaticamente na criação                   |
| updated_at | TIMESTAMP    | Atualizado automaticamente a cada alteração         |

---

### CargaHoraria

Entidade central. Vincula um professor a uma escola e armazena os dados
de horas — parte informada pelo professor, parte calculada automaticamente
pelo sistema.

| Campo            | Tipo          | Origem        | Observação                          |
|------------------|---------------|---------------|-------------------------------------|
| 🔑 id            | INT           | Auto          | Chave primária                      |
| periodosSemanais | INT           | Professor     | Quantidade de períodos por semana   |
| duracaoPeriodo   | INT           | Professor     | Duração de cada período em minutos  |
| semanasTrim1     | INT           | Professor     | Semanas no 1º trimestre             |
| semanasTrim2     | INT           | Professor     | Semanas no 2º trimestre             |
| semanasTrim3     | INT           | Professor     | Semanas no 3º trimestre             |
| ⚡ horasSemanal  | DECIMAL(10,2) | **Calculado** | (períodos × duração) ÷ 60          |
| ⚡ horasTrim1    | DECIMAL(10,2) | **Calculado** | horasSemanal × semanasTrim1         |
| ⚡ horasTrim2    | DECIMAL(10,2) | **Calculado** | horasSemanal × semanasTrim2         |
| ⚡ horasTrim3    | DECIMAL(10,2) | **Calculado** | horasSemanal × semanasTrim3         |
| ⚡ totalHoras    | DECIMAL(10,2) | **Calculado** | horasTrim1 + horasTrim2 + horasTrim3|
| 🔗 professor_id  | INT (FK)      | Token JWT     | Referência à tabela professores     |
| 🔗 escola_id     | INT (FK)      | Professor     | Referência à tabela escolas         |
| created_at       | TIMESTAMP     | Auto          | Gerado automaticamente              |
| updated_at       | TIMESTAMP     | Auto          | Atualizado automaticamente          |

---

## Relacionamentos

```
Professor (1) ──────── (N) CargaHoraria (N) ──────── (1) Escola
```

**Professor → CargaHoraria (1 para N)**
Um professor pode ter muitas cargas horárias — uma por escola onde leciona.
Cada carga horária pertence a exatamente um professor.

**Escola → CargaHoraria (1 para N)**
Uma escola pode ter muitas cargas horárias — de professores diferentes.
Cada carga horária pertence a exatamente uma escola.

Ambas as relações usam `ON DELETE CASCADE`: ao remover um professor ou escola,
todos os registros de carga horária vinculados são removidos automaticamente.

---

## Fórmula de Cálculo

```
horasSemanal = (periodosSemanais × duracaoPeriodo) ÷ 60
horasTrim1   = horasSemanal × semanasTrim1
horasTrim2   = horasSemanal × semanasTrim2
horasTrim3   = horasSemanal × semanasTrim3
totalHoras   = horasTrim1 + horasTrim2 + horasTrim3
```

### Exemplo com números reais

| Dado informado         | Valor |
|------------------------|-------|
| Períodos semanais      | 4     |
| Duração do período     | 50 min|
| Semanas — Trimestre 1  | 12    |
| Semanas — Trimestre 2  | 10    |
| Semanas — Trimestre 3  | 11    |

| Campo calculado  | Resultado  |
|------------------|------------|
| horasSemanal     | 3,33 h     |
| horasTrim1       | 40,00 h    |
| horasTrim2       | 33,33 h    |
| horasTrim3       | 36,67 h    |
| **totalHoras**   | **110,00 h** |

---

## Exemplo de requisição — POST /cargas

**Enviado pelo professor (Body JSON):**
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

**Retornado pelo sistema (201 Created):**
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
        "nome": "EMEF João Pessoa"
    }
}
```

> O `professor_id` é extraído automaticamente do token JWT — não precisa
> ser informado no body.

---

## Arquivos do diagrama

| Arquivo                  | Descrição                                   |
|--------------------------|---------------------------------------------|
| `diagrama_projeto.svg`   | Diagrama vetorial — abre em qualquer navegador |
| `Diagrama_Projeto.md`    | Este arquivo — documentação completa        |
