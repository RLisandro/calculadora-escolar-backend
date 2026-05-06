---

### Regras de Negócio - Calculadora Escolar Backend


# 📘 Regras de Negócio — Calculadora Escolar Backend

Este documento explica, de forma simples e direta, **o que a Calculadora Escolar faz, como ela funciona por dentro e quais tecnologias foram usadas para construí-la.** Foi escrito para que qualquer pessoa — mesmo sem conhecimento técnico — consiga entender a proposta do projeto.

---

## 1. 🎯 O Que é Este Projeto e Por Que Ele Existe?

### O Problema
Imagine um professor que trabalha em **3 escolas diferentes**. Em cada escola, a aula tem uma duração diferente (45 min, 50 min, 55 min), cada trimestre tem um número diferente de semanas letivas e cada contrato calcula as horas de um jeito.

Resultado? O professor precisa fazer contas manuais toda semana, usar planilhas confusas e, muitas vezes, acaba recebendo **menos do que deveria** porque não consegue provar a quantidade exata de horas trabalhadas.

### A Solução
A **Calculadora Escolar Backend** é um sistema online (uma API) que resolve tudo isso automaticamente. O professor cadastra suas escolas, informa quantos períodos de aula tem por semana, a duração de cada período e quantas semanas cada trimestre possui. **O sistema faz todos os cálculos sozinho** e entrega:

- ✅ Quantas horas ele trabalha **por semana** em cada escola
- ✅ Quantas horas ele trabalha **por trimestre**
- ✅ O **total de horas no ano** inteiro

> 💡 **Analogia:** Pense no sistema como uma **calculadora financeira pessoal**, mas em vez de calcular gastos e receitas, ela calcula o bem mais precioso do professor: **o tempo.**

---

## 2. 🛠️ Tecnologias Empregadas (O Que Foi Usado Para Construir)

Para quem não é da área de tecnologia, pense assim: construir um sistema é como construir uma casa. Você precisa de materiais (tijolos, cimento, fios) e ferramentas (martelo, furadeira). Abaixo, cada "material" e "ferramenta" usados neste projeto:

### 2.1 ## 🚀 Tecnologias Utilizadas

- **Node.js v24 (LTS)**
- **pnpm** (Gerenciador de pacotes de alta performance)
- **TypeScript**
- **Express**
- **TypeORM**
- **MySQL**
- **JWT (jsonwebtoken)**
- **bcryptjs**

---

### 2.2 O Organizador de Pedidos

| O que é | Para que serve | Analogia simples |
|---|---|---|
| **Express** (v4.22) | É o "recepcionista" do sistema. Quando o professor faz um pedido (ex: "me mostre minhas horas"), o Express recebe esse pedido e encaminha para o setor certo. | É como a **secretária da escola** que recebe o visitante e diz "por aqui, por favor". |
| **CORS** | Permite que o sistema seja acessado por sites e aplicativos de outros endereços na internet. | É como uma **autorização de visitante** — sem ela, o portão não abre. |

### 2.3 O Banco de Dados (Onde Tudo Fica Guardado)

| O que é | Para que serve | Analogia simples |
|---|---|---|
| **MySQL** | É o banco de dados — o lugar seguro onde ficam guardados os dados de professores, escolas e cargas horárias. | É como um **arquivo de aço com gavetas trancadas**, onde cada pasta tem os dados de um professor. |
| **TypeORM** (v0.3) | É o "tradutor" entre o código do sistema e o banco de dados. O programador escreve em TypeScript, e o TypeORM traduz para a linguagem que o MySQL entende. | É como um **intérprete de idiomas** numa reunião internacional. |

### 2.4 A Segurança (Proteção dos Dados)

| O que é | Para que serve | Analogia simples |
|---|---|---|
| **JWT** (JSON Web Token) | Quando o professor faz login, ele recebe um "crachá digital" temporário. Esse crachá é enviado em cada pedido para provar que ele é quem diz ser. Expira em 1 dia. | É como o **crachá de visitante** que você recebe ao entrar num prédio comercial. Sem ele, não passa da recepção. |
| **Bcryptjs** | Antes de guardar a senha do professor, o sistema embaralha ela de um jeito que ninguém consegue desembaralhar — nem o próprio sistema. Na hora do login, ele compara os embaralhamentos. | É como guardar a senha num **cofre que só abre com a chave certa**, mas ninguém consegue ver o que está dentro. |

### 2.5 Ferramentas de Desenvolvimento

| O que é | Para que serve | Analogia simples |
|---|---|---|
| **ts-node-dev** | Ferramenta que reinicia o sistema automaticamente toda vez que o programador salva uma alteração no código. | É como um **assistente que religa a máquina** toda vez que você troca uma peça. |
| **dotenv** | Lê as configurações sensíveis (senha do banco de dados, chave secreta) de um arquivo protegido, mantendo-as fora do código visível. | É como guardar a **senha do Wi-Fi num papel dentro da gaveta**, em vez de colar na parede. |

### 2.6 Como o Sistema é Organizado Por Dentro

O código foi dividido em **camadas**, como os departamentos de uma empresa. Cada camada tem uma função clara:

```
📨 Requisição do Professor
        ↓
  ┌─────────────────┐
  │   CONTROLLER    │  ← Recepção: recebe o pedido e encaminha
  └────────┬────────┘
           ↓
  ┌─────────────────┐
  │    SERVICE       │  ← Gerência: valida dados, faz os cálculos, aplica as regras
  └────────┬────────┘
           ↓
  ┌─────────────────┐
  │   REPOSITORY     │  ← Arquivo: salva e busca informações no banco de dados
  └────────┬────────┘
           ↓
  ┌─────────────────┐
  │  BANCO DE DADOS  │  ← Cofre: armazena tudo com segurança
  └─────────────────┘
```

> 💡 **Por que separar assim?** Pelo mesmo motivo que numa escola a secretária não dá aula e o professor não faz matrícula. Cada parte faz o que sabe fazer melhor, e se algo precisa mudar, mexemos **só naquela parte** sem estragar o resto.

---

## 3. 🧠 Lógica de Negócio (Como o Sistema Pensa)

Esta é a seção mais importante: aqui explicamos **as regras que o sistema segue** para garantir que tudo funcione corretamente.

### 3.1 Os Três Cadastros do Sistema

O sistema trabalha com três tipos de informação, que se conectam entre si:

**👨‍🏫 Professor** — Quem usa o sistema
- Tem nome, e-mail e senha
- Cada e-mail é único (não pode ter dois professores com o mesmo e-mail)

**🏫 Escola** — Onde o professor trabalha
- Tem apenas o nome
- Cada nome é único (não pode cadastrar "Escola Estadual ABC" duas vezes)

**📊 Carga Horária** — O trabalho do professor numa escola
- É o "elo" entre o professor e a escola
- Contém os dados de períodos, duração e semanas
- **Sempre pertence a um professor E a uma escola**

> 💡 **Como eles se conectam:** Um professor pode ter **várias** cargas horárias em **várias** escolas. Mas cada carga horária pertence a **um único** professor e está ligada a **uma única** escola.

### 3.2 Como o Login Funciona (Passo a Passo)

```
1️⃣  O professor se cadastra → O sistema guarda os dados e embaralha a senha
2️⃣  O professor faz login → O sistema confere se o e-mail e a senha batem
3️⃣  Se estiver correto → O sistema entrega um "crachá digital" (token)
4️⃣  Em cada pedido seguinte → O professor envia o crachá junto
5️⃣  O sistema confere o crachá → Se for válido, atende o pedido
```

**Regra de ouro:** Sem crachá válido, **nenhum dado** é mostrado ou alterado. Isso protege as informações do professor.

### 3.3 Como os Cálculos São Feitos

Aqui está o coração do sistema. Quando o professor cadastra uma carga horária, o sistema recebe estes dados:

| Dado informado | O que significa | Exemplo |
|---|---|---|
| Períodos Semanais | Quantas "aulas" o professor tem por semana naquela escola | 12 períodos |
| Duração do Período | Quantos minutos dura cada aula | 50 minutos |
| Semanas no Trim. 1 | Quantas semanas letivas tem o 1º trimestre | 11 semanas |
| Semanas no Trim. 2 | Quantas semanas letivas tem o 2º trimestre | 12 semanas |
| Semanas no Trim. 3 | Quantas semanas letivas tem o 3º trimestre | 13 semanas |

E o sistema calcula **automaticamente:**

**Passo 1 — Horas por semana:**
```
12 períodos × 50 minutos = 600 minutos ÷ 60 = 10 horas por semana
```

**Passo 2 — Horas por trimestre:**
```
Trimestre 1: 10 horas × 11 semanas = 110 horas
Trimestre 2: 10 horas × 12 semanas = 120 horas
Trimestre 3: 10 horas × 13 semanas = 130 horas
```

**Passo 3 — Total no ano:**
```
110 + 120 + 130 = 360 horas no ano
```

> 💡 **Por que isso importa?** Com esse número em mãos, o professor pode conferir se o contracheque está correto, negociar contratos com segurança e planejar seu tempo com precisão.

### 3.4 Regras de Proteção (O Que o Sistema NÃO Permite)

O sistema foi construído para **impedir erros** que poderiam gerar cálculos absurdos ou falhas de segurança:

#### ❌ Na hora de cadastrar o professor:
- Não pode cadastrar sem nome, e-mail ou senha
- Não pode usar um e-mail que outro professor já está usando

#### ❌ Na hora de cadastrar uma escola:
- Não pode cadastrar sem informar o nome
- Não pode cadastrar uma escola com o nome de outra que já existe

#### ❌ Na hora de cadastrar uma carga horária:
- Não pode colocar 0 ou número negativo nos períodos semanais
- Não pode colocar 0 ou número negativo na duração do período
- Não pode colocar número negativo nas semanas dos trimestres
- Não pode vincular a uma escola que não existe
- **Obrigatoriamente** precisa informar a qual escola a carga pertence

#### 🔒 Privacidade:
- O professor **só vê os dados dele**. O Professor A não consegue ver as cargas horárias do Professor B, mesmo que tente.
- Se um professor for excluído do sistema, **todas as cargas horárias dele** são apagadas automaticamente (para não deixar dados órfãos).

### 3.5 O Que Acontece Quando Algo Dá Errado

O sistema sempre responde de forma clara quando algo não funciona:

| Situação | O que o sistema responde |
|---|---|
| Tentou acessar sem fazer login | "Token JWT ausente. Faça login para obter o token." |
| O crachá (token) expirou | "Token JWT inválido ou expirado." |
| E-mail já está em uso | "Este e-mail já está em uso." |
| Escola não encontrada | "Escola não encontrada." |
| Períodos ou duração = 0 | "Períodos semanais e duração do período devem ser maiores que zero." |

> 💡 O professor **nunca** verá uma mensagem técnica incompreensível. Todas as mensagens de erro são escritas em português, de forma que ele saiba exatamente o que corrigir.

---

## 4. 📋 Exemplo Prático Completo

### Cenário: A Professora Maria

Maria acabou de ser convidada para dar aulas na **Escola Estadual Flores da Cunha**. Ela já trabalha em outra escola e quer comparar as cargas horárias. Veja como ela usaria o sistema:

**1. Maria se cadastra:**
```json
{ "nome": "Maria Silva", "email": "maria@email.com", "senha": "minhaSenha123" }
```

**2. Maria faz login e recebe seu crachá (token)**

**3. Maria cadastra a nova escola:**
```json
{ "nome": "Escola Estadual Flores da Cunha" }
```

**4. Maria cadastra sua carga horária na nova escola:**
```json
{
  "escola_id": 1,
  "periodosSemanais": 12,
  "duracaoPeriodo": 50,
  "semanasTrim1": 11,
  "semanasTrim2": 12,
  "semanasTrim3": 13
}
```

**5. O sistema responde com tudo calculado:**
```json
{
  "id": 1,
  "periodosSemanais": 12,
  "duracaoPeriodo": 50,
  "horasSemanal": 10.00,
  "horasTrim1": 110.00,
  "horasTrim2": 120.00,
  "horasTrim3": 130.00,
  "totalHoras": 360.00,
  "escola": { "id": 1, "nome": "Escola Estadual Flores da Cunha" }
}
```

Maria agora sabe que dedicará **360 horas no ano** a essa escola. Se o contracheque dela disser algo diferente, ela tem os dados para questionar.

---

## 5. 💡 Como o Professor Pode Usar Isso no Dia a Dia

1. **Conferir o contracheque:** Compare as horas calculadas pelo sistema com as horas que aparecem no seu holerite. Se houver diferença, você tem uma base sólida para conversar com a direção ou o RH.

2. **Simular mudanças:** A escola quer mudar a duração das aulas de 45 para 50 minutos? Cadastre uma nova carga horária com os novos valores e veja **antes da mudança acontecer** como isso vai afetar suas horas totais.

3. **Comparar escolas:** Cadastre as cargas de todas as suas escolas e veja, lado a lado, onde você dedica mais tempo. Isso ajuda a decidir se vale a pena aceitar novas turmas.

4. **Documentar sua carreira:** Todas as informações ficam salvas com data e hora. Ao longo dos anos, você constrói um **histórico profissional** completo.

---

## 6. 🚀 Tendências e Futuras Melhorias

O sistema atual já resolve o problema principal — calcular e organizar horas. Mas há muito espaço para crescer. Abaixo, as melhorias planejadas, divididas por prazo:

### 📅 Curto Prazo (próximas atualizações)

| Melhoria | O que muda para o professor |
|---|---|
| **Validação de dados mais inteligente** | Mensagens de erro ainda mais claras e específicas, indicando exatamente qual campo está com problema. |
| **Testes automáticos** | O sistema será testado automaticamente antes de cada atualização, garantindo que nenhuma correção quebre algo que já funcionava. |
| **Paginação nas listagens** | Quando o professor tiver muitas cargas cadastradas, o sistema mostrará os resultados em páginas (como o Google), em vez de tudo de uma vez. |
| **Documentação interativa da API** | Uma página web onde qualquer desenvolvedor pode ver e testar todos os comandos do sistema sem precisar de ferramentas extras. |

### 📅 Médio Prazo (próximos meses)

| Melhoria | O que muda para o professor |
|---|---|
| **Painel Visual (Dashboard)** | Uma tela bonita com gráficos mostrando horas por escola, comparativos entre trimestres e a visão geral da carreira — sem precisar ler números crus. |
| **Exportação de Relatórios** | Botão para baixar um PDF ou uma planilha Excel com o resumo completo das horas. Perfeito para entregar ao RH ou levar em reuniões sindicais. |
| **Alertas inteligentes** | O sistema avisa por e-mail quando a carga horária ultrapassar limites legais (ex: mais de 40h semanais) ou quando um trimestre estiver acabando. |
| **Sessão mais longa** | Hoje o login expira em 1 dia. No futuro, o sistema renovará a sessão automaticamente, sem precisar fazer login toda hora. |
| **Proteção contra ataques** | Limite de tentativas de login para impedir que alguém fique tentando adivinhar a senha do professor. |

### 📅 Longo Prazo (visão de futuro)

| Melhoria | O que muda para o professor |
|---|---|
| **Acesso para a escola** | As escolas também poderão se cadastrar e visualizar a carga de seus professores, criando um ecossistema integrado entre escola e docente. |
| **Calculadora para sala de aula** | Novos módulos de cálculo (equações, geometria, estatística) que o professor pode usar como ferramenta pedagógica com os alunos. |
| **Instalação simplificada (Docker)** | Qualquer pessoa poderá instalar o sistema inteiro com um único comando, sem precisar configurar banco de dados manualmente. |
| **Atualizações automáticas** | Toda alteração aprovada no código será testada e publicada automaticamente, sem precisar de intervenção manual. |
| **Inteligência Artificial** | O sistema poderá sugerir distribuições de aulas mais equilibradas com base no histórico do professor, ajudando a evitar sobrecarga. |
| **Aplicativo de celular** | Versão mobile para consultar e simular cargas horárias diretamente do smartphone, a qualquer hora e em qualquer lugar. |

---

*📝 Documento focado no suporte e autonomia do profissional da educação.*
