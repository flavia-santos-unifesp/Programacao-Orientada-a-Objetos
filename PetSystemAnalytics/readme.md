# PetSystem Analytics

## Descrição

O PetSystem Analytics é um sistema de gerenciamento para pet shops desenvolvido com foco na aplicação dos conceitos de Programação Orientada a Objetos (POO). O sistema permite o controle de clientes, pets, produtos, serviços e vendas, além da geração de indicadores de desempenho (KPIs), relatórios gerenciais e controle de estoque.

O objetivo do projeto é demonstrar, de forma prática, a utilização dos principais conceitos de POO em um cenário real de negócio.

---

## Funcionalidades

* Cadastro de clientes
* Cadastro de funcionários
* Cadastro de pets
* Cadastro de produtos
* Cadastro de serviços
* Registro de vendas
* Controle automático de estoque
* Geração de KPIs
* Geração de relatórios gerenciais
* Exportação de relatórios em CSV
* Simulação de exportação em PDF
* Validação de estoque disponível antes da venda

---

## Indicadores (KPIs)

O sistema calcula automaticamente os seguintes indicadores:

* Faturamento total
* Ticket médio
* Quantidade de vendas realizadas
* Produto mais vendido
* Serviço mais utilizado
* Cliente que mais gastou

---

## Conceitos de Programação Orientada a Objetos Utilizados

### Encapsulamento

Os atributos das classes são privados e acessados por meio de métodos públicos, garantindo maior segurança e controle dos dados.

### Herança

A classes `Cliente` herdm características comuns da classe `Pessoa`.

```text
Pessoa
├── Cliente
```

### Polimorfismo

Implementado através da interface `Exportador`, que possui diferentes implementações para exportação de relatórios.

```text
Exportador
├── ExportadorCSV
└── ExportadorPDF
```

### Abstração

As entidades do sistema foram modeladas através de classes que representam elementos do domínio do pet shop.

Exemplos:

* Pessoa
* Cliente
* Funcionário
* Pet
* Produto
* Serviço
* Venda

### Composição

O sistema utiliza composição para representar relacionamentos entre objetos.

```text
Cliente
 └── Pet

Venda
 └── ItemVenda
```

---

## Regras de Negócio

### Controle de Estoque

Ao registrar uma venda, o sistema reduz automaticamente a quantidade disponível em estoque.

Caso a quantidade solicitada seja superior ao estoque disponível, a venda é bloqueada e uma exceção é lançada.

Exemplo:

```text
Estoque disponível: 50
Quantidade solicitada: 999

Resultado:
Erro: Estoque insuficiente.
```

---

## Estrutura do Projeto

```text
src/
│
├── data/
│
├── interfaces/
│
├── models/
│
├── repositories/
│
├── reports/
│
├── services/
│
└── index.ts
```

---

## Como Executar

### Instalar dependências

```bash
npm install
```

### Executar o projeto

```bash
npx ts-node src/index.ts
```

---

## Exemplo de Saída

```text
===== RELATÓRIO DE KPIs =====

Faturamento Total: R$ 875
Ticket Médio: R$ 175
Quantidade de Vendas: 5
Produto Mais Vendido: Ração Premium
Serviço Mais Utilizado: Banho
Cliente que Mais Gastou: Flavia Fernandes

===== EXPORTAÇÃO =====

Arquivo CSV gerado com sucesso.
Exportação PDF simulada com sucesso.
```
---

## Autores
@AndreyPradoAP
@flavia-santos-unifesp
@rennanbritto

**PetSystem Analytics**
