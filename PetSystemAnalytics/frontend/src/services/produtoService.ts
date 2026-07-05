import type { CreateProdutoDTO, ProdutoResponse } from "../types";
import { fetchAPI } from "./api";

export const produtoService = {
  create: (dto: CreateProdutoDTO) =>
    fetchAPI<ProdutoResponse>("/produtos", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  findAll: () =>
    fetchAPI<ProdutoResponse[]>("/produtos"),

  findById: (id: number) =>
    fetchAPI<ProdutoResponse>(`/produtos/${id}`),

  update: (id: number, dto: Partial<CreateProdutoDTO>) =>
    fetchAPI<ProdutoResponse>(`/produtos/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),
};