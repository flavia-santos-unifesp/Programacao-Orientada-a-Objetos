import { Cliente } from "../models/Cliente";
import { Pet } from "../models/Pet";
import { Produto } from "../models/Produto";
import { Servico } from "../models/Servico";
import { ItemVenda } from "../models/ItemVenda";
import { Venda } from "../models/Venda";

// CLIENTES

export const cliente1 = new Cliente(
    1,
    "Rennan Britto",
    "11999999999",
    "rennan@email.com"
);

export const cliente2 = new Cliente(
    2,
    "Flavia Fernandes",
    "11888888888",
    "flavia@email.com"
);

export const cliente3 = new Cliente(
    3,
    "Andrey Prado",
    "11777777777",
    "andrey@email.com"
);

export const cliente4 = new Cliente(
    4,
    "Ana Oliveira",
    "11666666666",
    "ana@email.com"
);

// PETS

const malia = new Pet(
    1,
    "Malia",
    "Gato",
    "SDR",
    3
);

const leon = new Pet(
    2,
    "Leon",
    "Gato",
    "SDR",
    2
);

const thor = new Pet(
    3,
    "Thor",
    "Cachorro",
    "Golden Retriever",
    5
);

const matilda = new Pet(
    4,
    "Matilda",
    "Gato",
    "SDR",
    1
);

cliente1.adicionarPet(malia);
cliente2.adicionarPet(leon);
cliente3.adicionarPet(thor);
cliente2.adicionarPet(matilda);

// PRODUTOS

export const racao = new Produto(
    1,
    "Ração Premium",
    100,
    50
);

export const coleira = new Produto(
    2,
    "Coleira",
    50,
    30
);

export const brinquedo = new Produto(
    3,
    "Brinquedo",
    25,
    40
);

export const shampoo = new Produto(
    4,
    "Shampoo Pet",
    35,
    20
);

export const cama = new Produto(
    5,
    "Cama Pet",
    120,
    10
);

// SERVIÇOS

export const banho = new Servico(
    1,
    "Banho",
    40
);

export const tosa = new Servico(
    2,
    "Tosa",
    60
);

export const consulta = new Servico(
    3,
    "Consulta Veterinária",
    120
);

// VENDAS

export const venda1 = new Venda(
    1,
    cliente1,
    new Date()
);

venda1.adicionarItem(
    new ItemVenda(racao, 2)
);

venda1.adicionarItem(
    new ItemVenda(banho, 1)
);

export const venda2 = new Venda(
    2,
    cliente2,
    new Date()
);

venda2.adicionarItem(
    new ItemVenda(coleira, 1)
);

venda2.adicionarItem(
    new ItemVenda(tosa, 1)
);

export const venda3 = new Venda(
    3,
    cliente3,
    new Date()
);

venda3.adicionarItem(
    new ItemVenda(brinquedo, 3)
);

venda3.adicionarItem(
    new ItemVenda(banho, 1)
);

export const venda4 = new Venda(
    4,
    cliente4,
    new Date()
);

venda4.adicionarItem(
    new ItemVenda(cama, 1)
);

venda4.adicionarItem(
    new ItemVenda(consulta, 1)
);

export const venda5 = new Venda(
    5,
    cliente2,
    new Date()
);

venda5.adicionarItem(
    new ItemVenda(racao, 1)
);

venda5.adicionarItem(
    new ItemVenda(shampoo, 2)
);

const vendaErro = new Venda(
    999,
    cliente1,
    new Date()
);

vendaErro.adicionarItem(
    new ItemVenda(racao, 999)
);

// primeiro faz dando certo e depois add vendaErro no array abaixo para mostar que dá errado
export const vendas = [
    venda1,
    venda2,
    venda3,
    venda4,
    venda5,
];