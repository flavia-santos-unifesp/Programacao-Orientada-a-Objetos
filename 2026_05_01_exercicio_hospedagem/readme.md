# Sistema de Reservas

Projeto desenvolvido para a disciplina de Programação Orientada a Objetos com TypeScript.

**Alunos:**

* Flavia Fernandes
* Rennan Britto

A ideia é simular um sistema de reservas de acomodações, inspirado em plataformas como Airbnb, aplicando conceitos como polimorfismo, composição e organização em camadas.

---

## Objetivo

Implementar um sistema que permita:

* Cadastro de acomodações
* Cálculo de preços de reservas
* Aplicação de taxas
* Regras diferentes dependendo do tipo de acomodação

---

## Estrutura do Projeto

O projeto foi organizado em camadas para separar responsabilidades:

```
2026_05_01_exerciciohospedagem/
 ├── domain/
 ├── application/
 ├── infra/
 └── main.ts
```

### domain/

Contém as regras de negócio do sistema.

* accommodation → tipos de acomodação (House, Apartment, SharedRoom)
* booking → entidade de reserva
* fee → taxas
* service → serviço de cálculo de preço

### application/

Contém os casos de uso.

* CreateBooking → responsável por criar uma reserva

### infra/

Contém implementações externas.

* repositórios (neste caso, um repositório em memória)

---

## Decisões de Modelagem

### Polimorfismo

Cada tipo de acomodação implementa o método:

```
calculatePrice(days: number)
```

Assim, cada classe define sua própria lógica de cálculo, evitando uso de `if` ou `switch`.

---

### Composição (Taxas)

As taxas foram modeladas com uma interface `Fee`.

O `PricingService` recebe uma lista de taxas e aplica todas ao valor base.

Isso permite adicionar/remover taxas sem alterar outras partes do sistema.

---

### Separação de responsabilidades

* Acomodação → calcula seu preço base
* PricingService → aplica taxas
* Booking → consolida os valores
* Use case → organiza o fluxo

---

## Como rodar o projeto

### 1. Instalar dependências

```
npm install
```

### 2. Rodar o projeto

```
npm run dev
```

---

## Exemplo de execução

No arquivo `main.ts`, é criado um cenário simples:

* Cadastro de acomodações
* Definição de taxas
* Criação de uma reserva

Saída esperada no terminal:

```
Base: <valor>
Total: <valor com taxas>
```

---

## Observações

* Não utiliza banco de dados (repositório em memória)