import type { ClienteResponse, PetResponse, ProdutoResponse, VendaResponse, KPIResponse } from "../types";

export const mockClientes: ClienteResponse[] = [
  {
    id: 1,
    nome: "João Silva",
    telefone: "(11) 98765-4321",
    email: "joao@email.com",
    pontosFidelidade: 750,
    nivelFidelidade: "PRATA",
  },
  {
    id: 2,
    nome: "Maria Santos",
    telefone: "(11) 99876-5432",
    email: "maria@email.com",
    pontosFidelidade: 1200,
    nivelFidelidade: "OURO",
  },
];

export const mockPets: PetResponse[] = [
  {
    id: 1,
    nome: "Rex",
    especie: "CACHORRO",
    raca: "Golden Retriever",
    idade: 3,
    peso: 30,
    porte: "GRANDE",
    clienteId: 1,
  },
  {
    id: 2,
    nome: "Miau",
    especie: "GATO",
    raca: "Siamês",
    idade: 2,
    peso: 4,
    porte: "PEQUENO",
    clienteId: 1,
  },
];

export const mockProdutos: ProdutoResponse[] = [
  {
    id: 1,
    nome: "Ração Premium",
    preco: 85.90,
    estoque: 50,
  },
  {
    id: 2,
    nome: "Brinquedo Kong",
    preco: 45.50,
    estoque: 30,
  },
  {
    id: 3,
    nome: "Coleira com Guia",
    preco: 65.00,
    estoque: 20,
  },
];

export const mockVendas: VendaResponse[] = [
  {
    id: 1,
    clienteId: 1,
    cliente: mockClientes[0],
    data: new Date().toISOString(),
    itens: [],
    subtotal: 400,
    desconto: 20,
    total: 380,
  },
];

export const mockKPIs: KPIResponse = {
  faturamento: 5420.50,
  ticketMedio: 380.50,
  quantidadeVendas: 14,
  produtoMaisVendido: "Ração Premium",
  servicoMaisUtilizado: "Banho",
  clienteQueMaisGastou: "Maria Santos",
};