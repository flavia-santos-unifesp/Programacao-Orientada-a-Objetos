import { Accommodation } from "../../domain/accommodation/Accommodation"
import { AccommodationRepository } from "./AccommodationRepository"

// Implementação simples em memória
// Boa para teste / exercício

export class InMemoryAccommodationRepository implements AccommodationRepository {
  private items: Accommodation[] = []

  add(accommodation: Accommodation) {
    this.items.push(accommodation)
  }

  findById(id: string): Accommodation {
    const acc = this.items.find(a => a.id === id)

    if (!acc) {
      throw new Error("Accommodation not found")
    }

    return acc
  }
}