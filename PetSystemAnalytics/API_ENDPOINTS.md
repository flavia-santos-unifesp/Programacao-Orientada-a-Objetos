# API Endpoints - PetSystemAnalytics

## Base URL
```
http://localhost:3000/api
```

---

## 📋 Funcionários

### GET /funcionarios
Retorna lista de todos os funcionários.

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Dr. João",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "cargo": "Veterinário"
  }
]
```

### GET /funcionarios/:id
Retorna um funcionário específico.

**Parameters:**
- `id` (number) - ID do funcionário

**Response:**
```json
{
  "id": 1,
  "nome": "Dr. João",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cargo": "Veterinário"
}
```

### GET /funcionarios/cargo/:cargo
Retorna funcionários de um cargo específico.

**Parameters:**
- `cargo` (string) - Cargo do funcionário (ex: "Veterinário", "Banho e Tosa")

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Dr. João",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "cargo": "Veterinário"
  }
]
```

### POST /funcionarios
Cria um novo funcionário.

**Request Body:**
```json
{
  "nome": "Dr. João",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cargo": "Veterinário"
}
```

**Response:** (201)
```json
{
  "id": 1,
  "nome": "Dr. João",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cargo": "Veterinário"
}
```

### DELETE /funcionarios/:id
Deleta um funcionário.

**Parameters:**
- `id` (number) - ID do funcionário

**Response:** 204 No Content

---

## 📅 Agendamentos

### GET /agendamentos
Retorna lista de todos os agendamentos.

**Response:**
```json
[
  {
    "id": 1,
    "dataHora": "2026-07-10T10:00:00Z",
    "duracao": 60,
    "status": "CONFIRMADO",
    "funcionario": {
      "id": 1,
      "nome": "Dr. João",
      "cargo": "Veterinário"
    },
    "itemVenda": {
      "id": 42,
      "tipo": "SERVICO",
      "servico": "CONSULTA",
      "pet": {
        "id": 5,
        "nome": "Rex",
        "cliente": {
          "id": 2,
          "nome": "Maria Silva"
        }
      }
    }
  }
]
```

### GET /agendamentos/:id
Retorna um agendamento específico.

**Parameters:**
- `id` (number) - ID do agendamento

**Response:**
```json
{
  "id": 1,
  "dataHora": "2026-07-10T10:00:00Z",
  "duracao": 60,
  "status": "CONFIRMADO",
  "funcionario": { ... },
  "itemVenda": { ... }
}
```

### GET /agendamentos/funcionario/:funcionarioId/data/:data
Retorna agendamentos de um funcionário em uma data específica.

**Parameters:**
- `funcionarioId` (number) - ID do funcionário
- `data` (string) - Data no formato ISO (YYYY-MM-DD)

**Response:**
```json
[
  { agendamento objects }
]
```

### POST /agendamentos/verificar-disponibilidade
Verifica se um funcionário está disponível em um horário.

**Request Body:**
```json
{
  "funcionarioId": 1,
  "dataHora": "2026-07-10T10:00:00Z",
  "duracao": 60
}
```

**Response:**
```json
{
  "disponivel": true
}
```

### POST /agendamentos
Cria um novo agendamento (valida automaticamente disponibilidade).

**Request Body:**
```json
{
  "funcionarioId": 1,
  "dataHora": "2026-07-10T10:00:00Z",
  "duracao": 60,
  "itemVendaId": 42
}
```

**Response:** (201)
```json
{
  "id": 1,
  "dataHora": "2026-07-10T10:00:00Z",
  "duracao": 60,
  "status": "PENDENTE",
  "funcionario": { ... },
  "itemVenda": { ... }
}
```

**Error Response:** (400)
```json
{
  "error": "Funcionário não está disponível neste horário"
}
```

### PATCH /agendamentos/:id/status
Atualiza o status de um agendamento.

**Parameters:**
- `id` (number) - ID do agendamento

**Request Body:**
```json
{
  "status": "CONFIRMADO"
}
```

**Valid Status Values:**
- `PENDENTE` - Agendamento recém criado
- `CONFIRMADO` - Agendamento confirmado
- `REALIZADO` - Serviço já foi realizado
- `CANCELADO` - Agendamento foi cancelado

**Response:**
```json
{
  "id": 1,
  "dataHora": "2026-07-10T10:00:00Z",
  "duracao": 60,
  "status": "CONFIRMADO",
  "funcionario": { ... },
  "itemVenda": { ... }
}
```

---

## 📊 Relatórios de Agenda

### GET /relatorios/agenda
Gera relatório de agendamentos para um período.

**Query Parameters:**
- `dataInicio` (string, required) - Data de início (ISO format)
- `dataFim` (string, required) - Data de término (ISO format)

**Example:**
```
GET /relatorios/agenda?dataInicio=2026-07-01&dataFim=2026-07-31
```

**Response:**
```json
{
  "dataRelatorio": "2026-07-06T10:30:00Z",
  "totalAgendamentos": 15,
  "agendamentoPorStatus": {
    "PENDENTE": 2,
    "CONFIRMADO": 10,
    "REALIZADO": 3,
    "CANCELADO": 0
  },
  "agendamentoPorFuncionario": [
    {
      "funcionarioId": 1,
      "funcionarioNome": "Dr. João",
      "cargo": "Veterinário",
      "totalAgendamentos": 8,
      "agendamentoPorStatus": {
        "PENDENTE": 1,
        "CONFIRMADO": 6,
        "REALIZADO": 1,
        "CANCELADO": 0
      }
    }
  ],
  "agendamentoPorServico": [
    {
      "servico": "CONSULTA",
      "quantidade": 5
    },
    {
      "servico": "BANHO",
      "quantidade": 3
    }
  ]
}
```

### GET /relatorios/agenda/funcionario/:funcionarioId
Gera relatório de agendamentos para um funcionário em um período.

**Parameters:**
- `funcionarioId` (number) - ID do funcionário

**Query Parameters:**
- `dataInicio` (string, required)
- `dataFim` (string, required)

**Example:**
```
GET /relatorios/agenda/funcionario/1?dataInicio=2026-07-01&dataFim=2026-07-31
```

**Response:**
```json
{
  "funcionario": {
    "id": 1,
    "nome": "Dr. João",
    "cargo": "Veterinário"
  },
  "dataRelatorio": "2026-07-06T10:30:00Z",
  "totalAgendamentos": 8,
  "agendamentoPorStatus": {
    "PENDENTE": 1,
    "CONFIRMADO": 6,
    "REALIZADO": 1,
    "CANCELADO": 0
  },
  "agendamentos": [
    {
      "id": 1,
      "dataHora": "2026-07-10T10:00:00Z",
      "duracao": 60,
      "status": "CONFIRMADO",
      "cliente": "Maria Silva",
      "pet": "Rex",
      "servico": "CONSULTA"
    }
  ]
}
```

### GET /relatorios/agenda/data/:data
Gera relatório de agendamentos para uma data específica.

**Parameters:**
- `data` (string) - Data no formato ISO (YYYY-MM-DD)

**Example:**
```
GET /relatorios/agenda/data/2026-07-10
```

**Response:**
```json
{
  "dataRelatorio": "2026-07-06T10:30:00Z",
  "totalAgendamentos": 5,
  "agendamentoPorStatus": { ... },
  "agendamentoPorFuncionario": [ ... ],
  "agendamentoPorServico": [ ... ]
}
```

### GET /relatorios/agenda/texto
Gera relatório de agendamentos em formato texto.

**Query Parameters:**
- `dataInicio` (string, required)
- `dataFim` (string, required)

**Example:**
```
GET /relatorios/agenda/texto?dataInicio=2026-07-01&dataFim=2026-07-31
```

**Response:** (text/plain)
```
===== RELATÓRIO DE AGENDAMENTOS =====
Data do Relatório: 06/07/2026
Período: 01/07/2026 a 31/07/2026

Total de Agendamentos: 15

--- Agendamentos por Status ---
PENDENTE: 2
CONFIRMADO: 10
REALIZADO: 3
CANCELADO: 0

--- Agendamentos por Funcionário ---

Dr. João (Veterinário)
Total: 8
  PENDENTE: 1
  CONFIRMADO: 6
  REALIZADO: 1

Maria Silva (Banho e Tosa)
Total: 7
  CONFIRMADO: 4
  REALIZADO: 2
  CANCELADO: 1

--- Agendamentos por Serviço ---
CONSULTA: 5
BANHO: 3
TOSA: 4
HOSPEDAGEM: 3

=====================================
```

---

## ⚙️ Exemplos de Uso

### JavaScript/TypeScript Frontend

```typescript
// Buscar todos os funcionários
const response = await fetch('http://localhost:3000/api/funcionarios');
const funcionarios = await response.json();

// Criar novo funcionário
const novoFunc = await fetch('http://localhost:3000/api/funcionarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Dr. João',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    cargo: 'Veterinário'
  })
});

// Verificar disponibilidade
const disponibilidade = await fetch(
  'http://localhost:3000/api/agendamentos/verificar-disponibilidade',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      funcionarioId: 1,
      dataHora: '2026-07-10T10:00:00Z',
      duracao: 60
    })
  }
);

// Criar agendamento
const agendamento = await fetch('http://localhost:3000/api/agendamentos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    funcionarioId: 1,
    dataHora: '2026-07-10T10:00:00Z',
    duracao: 60,
    itemVendaId: 42
  })
});

// Gerar relatório
const relatorio = await fetch(
  'http://localhost:3000/api/relatorios/agenda?' +
  'dataInicio=2026-07-01&dataFim=2026-07-31'
);
```

---

## ❌ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Deleção bem-sucedida |
| 400 | Bad Request - Dados inválidos ou ausentes |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 🔄 Status de Agendamento

- **PENDENTE**: Estado inicial, aguardando confirmação
- **CONFIRMADO**: Agendamento foi confirmado
- **REALIZADO**: Serviço foi executado
- **CANCELADO**: Agendamento foi cancelado
