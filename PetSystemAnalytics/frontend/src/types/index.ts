// Enums
export type Especie =
  | "CACHORRO"
  | "GATO"
  | "AVE"
  | "PEIXE"
  | "ROEDOR"
  | "REPTIL"
  | "OUTRO";

export type Porte =
  | "PEQUENO"
  | "MEDIO"
  | "GRANDE";

export type NivelFidelidade =
  | "BRONZE"
  | "PRATA"
  | "OURO";

export type TipoServico =
  | "BANHO"
  | "TOSA"
  | "CONSULTA"
  | "HOSPEDAGEM";

// DTOs
export interface CreateClienteDTO {
  nome: string;
  telefone: string;
  email: string;
}

export interface ClienteResponse extends CreateClienteDTO {
  id: number;
  pontosFidelidade: number;
  nivelFidelidade: NivelFidelidade;
}

export interface CreatePetDTO {
  nome: string;
  especie: Especie;
  raca: string;
  idade: number;
  peso: number;
  porte: Porte;
  clienteId: number;
  cliente: CreateClienteDTO;
}

export interface PetResponse extends CreatePetDTO {
  id: number;
}

export interface CreateProdutoDTO {
  nome: string;
  preco: number;
  estoque: number;
}

export interface ProdutoResponse extends CreateProdutoDTO {
  id: number;
}

export interface CreateItemVendaDTO {
  produtoId?: number;
  servico?: TipoServico;
  quantidade: number;
  petId?: number;
  dataHora?: string; // ISO format for scheduled services
  funcionarioId?: number; // Only for services
}

export interface CreateVendaDTO {
  clienteId: number;
  itens: CreateItemVendaDTO[];
}

export interface ItemVendaResponse {
  id: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  item: ProdutoResponse | { tipo: TipoServico; nome: string };
}

export interface VendaResponse {
  id: number;
  clienteId: number;
  cliente: ClienteResponse;
  data: string;
  itens: ItemVendaResponse[];
  subtotal: number;
  desconto: number;
  total: number;
}

export interface KPIResponse {
  faturamento: number;
  ticketMedio: number;
  quantidadeVendas: number;
  produtoMaisVendido: string;
  servicoMaisUtilizado: string;
  clienteQueMaisGastou: string;
}