import type { CreateClienteDTO, ClienteResponse } from "../types";
import { fetchAPI } from "./api";

export const clienteService = {
  create: (dto: CreateClienteDTO) =>
    fetchAPI<ClienteResponse>("/clientes", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  findAll: () =>
    fetchAPI<ClienteResponse[]>("/clientes"),

  findById: (id: number) =>
    fetchAPI<ClienteResponse>(`/clientes/${id}`),
};