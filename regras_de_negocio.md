# Regras de Negócio - Calculadora Escolar Backend

Este documento detalha as diretrizes, fórmulas e a lógica da **Calculadora Escolar Backend**, uma plataforma desenvolvida exclusivamente para **auxiliar o professor** na gestão de sua carreira, carga horária e organização institucional.

---

## 1. Visão Geral e Necessidade do Projeto

### Propósito
A **Calculadora Escolar Backend** é uma ferramenta de gestão estratégica para o docente. Ela foi criada para solucionar a complexidade de organizar horários em múltiplas instituições, garantindo que o professor tenha total controle sobre sua jornada de trabalho e remuneração.

### Por que este projeto?
O dia a dia do professor envolve lidar com diferentes durações de aula, calendários trimestrais variados e contratos distintos. Esta API conecta a tecnologia à rotina docente para:
- **Gestão de Carreira:** Centralizar dados de diferentes escolas em um único lugar seguro.
- **Precisão Financeira:** Automatizar o cálculo de horas para evitar divergências em folhas de pagamento e contratos.
- **Autonomia Tecnológica:** Fornecer ao professor uma ferramenta moderna que reflete sua organização e profissionalismo.

---

## 2. Stack Tecnológico (Linguagens e Ferramentas)

Para garantir que seus dados estejam sempre seguros e acessíveis, utilizamos:

- **Node.js:** O motor que garante respostas rápidas para os seus cálculos.
- **TypeScript:** Um sistema de segurança que evita erros de digitação e lógica, garantindo que os resultados dos seus cálculos sejam sempre exatos.
- **Express:** O organizador que gerencia as solicitações que você faz à plataforma.
- **TypeORM & MySQL:** O sistema de arquivo e o banco de dados que guardam seu histórico de escolas e cargas horárias com integridade.
- **JWT (JSON Web Token):** Sua chave de acesso pessoal. Garante que apenas você veja e edite suas informações.
- **Bcryptjs:** O cofre de segurança. Criptografa sua senha de acesso, tornando-a ilegível para terceiros.

---

## 3. Regras de Negócio (Core do Sistema)

As regras de negócio garantem a fidelidade dos seus dados administrativos.

### A. Gestão de Carga Horária
O sistema processa sua jornada docente com precisão matemática:
1.  **Cálculo de Horas Semanais:** `(Períodos * Duração da Aula) / 60`. Essencial para validar o contrato semanal.
2.  **Projeção Trimestral:** Multiplica a carga semanal pelo número de semanas letivas de cada trimestre, permitindo o planejamento de longo prazo.
3.  **Consolidado Anual:** Soma dos trimestres para dar a visão real do tempo dedicado a cada instituição.

### B. Validações de Segurança Docente
- **Impedimento de Erros Críticos:** O sistema não permite durações de aula zeradas ou negativas, protegendo a integridade dos seus relatórios.
- **Vínculo Institucional:** Toda carga horária deve estar atrelada a uma escola cadastrada, garantindo que seu histórico esteja sempre organizado por instituição.

---

## 4. Casos de Uso (Exemplos Práticos)

### O Professor em Ação
Imagine que você recebeu uma nova oferta de trabalho para 12 períodos de 50 minutos. Você pode usar a API para simular e salvar essa nova carga horária, vendo instantaneamente o impacto no seu trimestre.

**Entrada de Dados:**
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

**Resultado Gerado para o Professor:**
O sistema entrega o cálculo pronto para ser usado em seu planejamento:
`"horasSemanal": 10.0`, `"totalHorasAnual": 360.0`.

---

## 5. Uso na Gestão e Prática Docente (Para o Professor)

Esta seção sugere como você pode utilizar as regras de negócio deste sistema para otimizar sua rotina e sua posição como autoridade técnica:

1.  **Análise de Impacto de Mudanças:** Use a lógica do sistema para prever como mudanças na grade escolar (ex: aumento do período de 45 para 50 minutos) afetarão sua carga horária total e seu tempo de descanso. Isso fundamenta suas negociações com a gestão escolar.
2.  **Auditoria de Contrato:** Utilize os cálculos automatizados para conferir se as horas registradas em seus contracheques batem com a realidade trabalhada, evitando o trabalho não remunerado.
3.  **O Professor como Mentor de Tecnologia:** Ao dominar essas regras de negócio, o professor pode demonstrar aos seus alunos como a matemática e a lógica são aplicadas para resolver problemas reais de gestão, posicionando-se não apenas como instrutor, mas como um profissional que utiliza a tecnologia a seu favor.
4.  **Expansão Customizada:** A arquitetura modular permite que o professor solicite ou implemente novos módulos (como cálculo de equações ou áreas) para automatizar outras partes de sua rotina didática.

---
*Documento focado no suporte e autonomia do profissional da educação.*
