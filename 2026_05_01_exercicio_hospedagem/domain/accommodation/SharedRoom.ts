import { Accommodation } from "./Accommodation"

// Quarto compartilhado é o mais simples

export class SharedRoom implements Accommodation {
  constructor(
    public id: string,
    private pricePerDay: number
  ) {}

  calculatePrice(days: number): number {
    // sem taxas extras
    return this.pricePerDay * days
  }
}