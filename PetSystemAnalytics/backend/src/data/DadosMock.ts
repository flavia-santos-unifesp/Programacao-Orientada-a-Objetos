import { Cliente } from "../models/Cliente";
import { Pet } from "../models/Pet";
import { Produto } from "../models/Produto";
import { ItemVenda } from "../models/ItemVenda";
import { Venda } from "../models/Venda";
import { Especie } from "../models/Especie";
import { Porte } from "../models/Porte";
import { Banho } from "../models/service-types/Banho";
import { Tosa } from "../models/service-types/Tosa";
import { Consulta } from "../models/service-types/Consulta";
import { Hospedagem } from "../models/service-types/Hospedagem";

// =====================
// CLIENTES
// =====================

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

// =====================
// PETS
// =====================

const malia = new Pet(
    1,
    "Malia",
    Especie.GATO,
    "SRD",
    3,
    3.8,
    Porte.PEQUENO
);

const leon = new Pet(
    2,
    "Leon",
    Especie.GATO,
    "SRD",
    8,
    9.5,
    Porte.PEQUENO
);

const thor = new Pet(
    3,
    "Thor",
    Especie.CACHORRO,
    "Golden Retriever",
    5,
    32,
    Porte.GRANDE
);

const matilda = new Pet(
    4,
    "Matilda",
    Especie.GATO,
    "SRD",
    7,
    4.6,
    Porte.PEQUENO
);

const agnes = new Pet(
    5,
    "Agnes",
    Especie.GATO,
    "SRD",
    2,
    3.4,
    Porte.PEQUENO
);

cliente1.adicionarPet(malia);
cliente2.adicionarPet(leon);
cliente3.adicionarPet(thor);
cliente2.adicionarPet(matilda);
cliente2.adicionarPet(agnes);

// =====================
// PRODUTOS
// =====================

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

// =====================
// SERVIÇOS
// =====================

export const banho = new Banho();

export const tosa = new Tosa();

export const consulta = new Consulta();

export const hospedagem = new Hospedagem();

// =====================
// VENDAS
// =====================

export const venda1 = new Venda(
    1,
    cliente1,
    new Date()
);

venda1.adicionarItem(new ItemVenda(racao, 2));
venda1.adicionarItem(new ItemVenda(banho, 1));

export const venda2 = new Venda(
    2,
    cliente2,
    new Date()
);

venda2.adicionarItem(new ItemVenda(coleira, 1));
venda2.adicionarItem(new ItemVenda(tosa, 1));

export const venda3 = new Venda(
    3,
    cliente3,
    new Date()
);

venda3.adicionarItem(new ItemVenda(brinquedo, 3));
venda3.adicionarItem(new ItemVenda(banho, 1));

export const venda4 = new Venda(
    4,
    cliente4,
    new Date()
);

venda4.adicionarItem(new ItemVenda(cama, 1));
venda4.adicionarItem(new ItemVenda(consulta, 1));

export const venda5 = new Venda(
    5,
    cliente2,
    new Date()
);

venda5.adicionarItem(new ItemVenda(racao, 1));
venda5.adicionarItem(new ItemVenda(shampoo, 2));

const vendaErro = new Venda(
    999,
    cliente1,
    new Date()
);

vendaErro.adicionarItem(new ItemVenda(racao, 999));

// Primeiro execute normalmente.
// Depois adicione "vendaErro" no array abaixo para testar a exceção de estoque.

export const vendas = [
    venda1,
    venda2,
    venda3,
    venda4,
    venda5
];