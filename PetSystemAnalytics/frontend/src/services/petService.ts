import type { CreatePetDTO, PetResponse } from "../types";
import { fetchAPI } from "./api";

export const petService = {
  create: (dto: CreatePetDTO) =>
    fetchAPI<PetResponse>("/pets", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  findAll: () =>
    fetchAPI<PetResponse[]>("/pets"),

  findById: (id: number) =>
    fetchAPI<PetResponse>(`/pets/${id}`),

  findByClienteId: (clienteId: number) =>
    fetchAPI<PetResponse[]>(`/pets/cliente/${clienteId}`),
};