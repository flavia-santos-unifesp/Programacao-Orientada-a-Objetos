# Sistema de Agendamento com Funcionários

## Descrição

Este módulo implementa um sistema completo de gerenciamento de funcionários e agendamento de serviços, com controle automático de disponibilidade.

## Funcionalidades

### 1. Gerenciamento de Funcionários
- Cadastro de funcionários com cargo
- Listagem de todos os funcionários
- Identificação por cargo (Gerente, Veterinário, Banho e Tosa, Recepcionista, etc.)

### 2. Agendamento Inteligente
- Agendamento de serviços vinculado a um funcionário
- Verificação automática de disponibilidade em tempo real
- Prevenção de conflitos: o mesmo funcionário não pode ter 2 serviços no mesmo horário
- Suporte a diferentes durações (30 min, 1h, 1.5h, 2h, 3h)

### 3. Controle de Status
- **PENDENTE**: Agendamento recém criado
- **CONFIRMADO**: Agendamento confirmado
- **REALIZADO**: Serviço já foi realizado
- **CANCELADO**: Agendamento foi cancelado

## Arquitetura

### Backend

#### Modelos
- **Funcionario**: Herda de `Pessoa`, adiciona atributo `cargo`
- **Agendamento**: Relaciona funcionário a um `ItemVenda` com data/hora
- **StatusAgendamento**: Enum para controlar estados

#### Repositories
- **FuncionarioRepository**: CRUD de funcionários + busca por cargo
  - Implementa `IRepository<Funcionario, CreateFuncionarioDTO>`
- **AgendamentoRepository**: CRUD de agendamentos + busca por período
  - Implementa `IRepository<Agendamento, CreateAgendamentoDTO>`
  - Método especial: `findByFuncionarioAndPeriodo()` para verificar conflitos

#### Services
- **AgendamentoService**: 
  - `verificarDisponibilidade()`: Valida se funcionário está livre no período
  - `agendar()`: Cria agendamento após validação
  - `listarPorFuncionarioEData()`: Lista agenda de um dia

### Frontend

#### Componentes
- **FuncionarioForm.tsx**: Formulário para cadastrar funcionário
- **FuncionarioList.tsx**: Lista com opções de editar/deletar
- **AgendamentoForm.tsx**: Formulário com verificação de disponibilidade
- **Funcionarios.tsx**: Página principal de gerenciamento

## Validações de Disponibilidade

O sistema utiliza lógica de sobreposição de tempo para verificar conflitos:

```
dataHora < agendamento.fim && dataFim > agendamento.inicio
```

**Exemplos:**
- Funcionário com consulta de 10:00 às 11:00
  - ❌ Novo agendamento 10:30-11:30 (sobrepõe)
  - ❌ Novo agendamento 9:30-10:30 (sobrepõe)
  - ❌ Novo agendamento 10:00-11:00 (conflita totalmente)
  - ✅ Novo agendamento 11:00-12:00 (depois)
  - ✅ Novo agendamento 9:00-10:00 (antes)

## Relacionamentos

```
Funcionario 1 --- * Agendamento
ItemVenda 1 --- 1 Agendamento
```

- Um funcionário pode ter múltiplos agendamentos
- Cada `ItemVenda` tem no máximo 1 agendamento (relação 1:1)

## Fluxo de Uso

1. **Cadastrar Funcionário**
   - Acesso: Menu → Funcionários
   - Preencher: Nome, Email, Telefone, Cargo

2. **Registrar Venda de Serviço**
   - Criar venda com `ItemVenda` de tipo SERVICO
   - Especificar: Pet, Tipo de Serviço

3. **Agendar Serviço**
   - No `ItemVenda`, clicar "Agendar"
   - Selecionar funcionário (filtrado por cargo compatível)
   - Escolher data/hora
   - Sistema verifica disponibilidade automaticamente
   - Confirmar se disponível

4. **Confirmar Agendamento**
   - Status muda para CONFIRMADO
   - Funcionário recebe notificação

5. **Concluir Serviço**
   - Após realização, status → REALIZADO

## Banco de Dados

### Tabelas Adicionadas

**Funcionario**
```sql
CREATE TABLE "Funcionario" (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  cargo TEXT NOT NULL
);
```

**Agendamento**
```sql
CREATE TABLE "Agendamento" (
  id SERIAL PRIMARY KEY,
  dataHora TIMESTAMP NOT NULL,
  duracao INT DEFAULT 60,
  status StatusAgendamento DEFAULT 'PENDENTE',
  funcionarioId INT NOT NULL REFERENCES Funcionario(id),
  itemVendaId INT UNIQUE NOT NULL REFERENCES ItemVenda(id)
);
```

### Migration
Executar: `npx prisma migrate dev`

## Exemplos de Código

### Verificar Disponibilidade
```typescript
const agendamentoService = new AgendamentoService(
  agendamentoRepository,
  funcionarioRepository
);

const disponivel = await agendamentoService.verificarDisponibilidade(
  funcionarioId,
  new Date('2026-07-06T10:00:00'),
  60 // 1 hora
);
```

### Agendar Serviço
```typescript
const agendamento = await agendamentoService.agendar({
  funcionarioId: 1,
  itemVendaId: 42,
  dataHora: new Date('2026-07-06T10:00:00'),
  duracao: 60
});
```

### Listar Agenda do Dia
```typescript
const agenda = await agendamentoService.listarPorFuncionarioEData(
  funcionarioId,
  new Date('2026-07-06')
);
```

## Conceitos POO Aplicados

- **Herança**: `Funcionario extends Pessoa`
- **Encapsulamento**: Estados privados do `Agendamento` com getters
- **Abstração**: `IRepository` com múltiplas implementações
- **Polimorfismo**: Diferentes durações de serviço conforme o tipo
- **Composição**: `Agendamento` composto por `Funcionario` e `ItemVenda`

## TODO / Próximas Melhorias

- [ ] API endpoints para Frontend (GET/POST agendamentos e funcionários)
- [ ] Integração com email para notificações
- [ ] Relatório de agenda por funcionário
- [ ] Filtro de funcionários por cargo na tela de agendamento
- [ ] Edição de agendamentos
- [ ] Autenticação e permissões
- [ ] Sincronização com calendários externos (Google Calendar, etc.)
- [ ] Testes automatizados
