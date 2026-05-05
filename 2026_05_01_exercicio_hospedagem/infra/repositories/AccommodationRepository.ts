import { Accommodation } from "../../domain/accommodation/Accommodation"

// Interface do repositório
// Serve para desviar de banco de dados

export interface AccommodationRepository {
  findById(id: string): Accommodation
}