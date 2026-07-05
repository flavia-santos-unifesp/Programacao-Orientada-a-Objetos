import type { CreateVendaDTO, VendaResponse } from "../types";
import { fetchAPI } from "./api";

export const vendaService = {
  create: (dto: CreateVendaDTO) =>
    fetchAPI<VendaResponse>("/vendas", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  findAll: () =>
    fetchAPI<VendaResponse[]>("/vendas"),

  findById: (id: number) =>
    fetchAPI<VendaResponse>(`/vendas/${id}`),
};