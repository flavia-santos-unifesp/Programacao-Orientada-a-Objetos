# PetSystem Analytics

Sistema de gestão para pet shop e clínica veterinária, desenvolvido como projeto acadêmico de Programação Orientada a Objetos (POO).

## Visão Geral

O projeto está dividido em duas aplicações:

1. `backend` (Express + TypeScript + Prisma)
2. `frontend` (React + TypeScript + Vite)

O sistema cobre gestão de clientes, pets, funcionários, produtos, vendas, serviços com agendamento e acompanhamento de agenda semanal por funcionário.

## Funcionalidades Atuais

1. Cadastro de clientes, pets, funcionários e produtos
2. Venda de produtos na tela `Vendas` com desconto por fidelidade
3. Venda de serviços concentrada na tela `Agendar Serviço`
4. Agendamento com seleção de funcionário apto por tipo de serviço
5. Cálculo de preço de serviço por pet (peso/porte), conforme regra do backend
6. Validação de horário comercial para agendamento
7. Verificação de conflito de horários por funcionário
8. Agenda em formato calendário semanal por funcionário
9. Dashboard com KPIs e rankings (faturamento, ticket médio, mais vendidos)
10. Relatórios e exportações (CSV/PDF conforme camada de relatórios)

## Regras de Negócio Relevantes

1. Controle de estoque automático para vendas de produtos
2. Desconto por fidelidade (BRONZE/PRATA/OURO)
3. Agendamento somente em horário comercial
4. Bloqueio de sobreposição de agendamentos por funcionário
5. Alocação de funcionário conforme serviço (ex.: consulta exige perfil compatível)

## Conceitos de POO Aplicados

1. Encapsulamento
2. Herança (`Pessoa` como base para entidades de pessoas)
3. Polimorfismo (serviços e relatórios com comportamentos específicos)
4. Abstração (camadas de domínio e contratos)
5. Composição (`Cliente` com pets, `Venda` com itens)
6. Padrões de projeto: Repository, Service, Mapper e Factory

## Estrutura do Repositório

```text
PetSystemAnalytics/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── constants/
│   │   ├── dto/
│   │   ├── factories/
│   │   ├── interfaces/
│   │   ├── mappers/
│   │   ├── models/
│   │   ├── reports/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   └── tests/
└── frontend/
	├── src/
	│   ├── components/
	│   ├── pages/
	│   ├── services/
	│   └── types/
	└── index.html
```

## Como Executar

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Scripts Principais

### Backend

1. `npm run dev` - inicia API em desenvolvimento
2. `npm run build` - gera build TypeScript + Prisma
3. `npm run test` - executa testes com Vitest

### Frontend

1. `npm run dev` - inicia aplicação Vite
2. `npm run build` - build de produção
3. `npm run lint` - lint do frontend

## Autores

1. @AndreyPradoAP
2. @flavia-santos-unifesp
3. @rennanbritto
