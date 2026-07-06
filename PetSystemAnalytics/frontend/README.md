# Frontend - PetSystem Analytics

Aplicação React responsável pela interface de gestão do sistema.

## Stack

1. React 19
2. TypeScript
3. Vite
4. Recharts (gráficos no dashboard)

## Páginas Principais

1. Dashboard
2. Clientes
3. Pets
4. Produtos
5. Serviços
6. Vendas (somente produtos)
7. Agendar Serviço (venda + agendamento de serviços)
8. Funcionários
9. Agenda (visão calendário semanal por funcionário)
10. O Projeto
11. Equipe

## Fluxos Importantes

### Venda de Produtos

1. Acontece na página `Vendas`
2. Aplicação de desconto por fidelidade
3. Controle de estoque integrado ao backend

### Venda e Agendamento de Serviços

1. Acontece na página `Agendar Serviço`
2. Seleção de cliente, pet, serviço e funcionário disponível
3. Cálculo de preço por pet (peso/porte) via API
4. Validação de horário comercial e conflitos de agenda

### Agenda de Funcionários

1. Página `Agenda` em formato calendário semanal
2. Visualização de alocação por funcionário
3. Leitura de disponibilidade por intervalos livres

## Execução

```bash
npm install
npm run dev
```

Aplicação padrão em `http://localhost:5173`.

## Scripts

1. `npm run dev` - ambiente de desenvolvimento
2. `npm run build` - build de produção
3. `npm run preview` - preview local do build
4. `npm run lint` - lint do código

## Integração com Backend

Este frontend consome os endpoints da API do backend (Express + Prisma), incluindo:

1. `/clientes`, `/pets`, `/produtos`, `/funcionarios`
2. `/vendas`
3. `/servicos/preco/:petId/:tipo`
4. `/agendamentos`, `/agendamentos/disponibilidade/:tipoServico`, `/agendamentos/sugerir-horarios/:tipoServico`
