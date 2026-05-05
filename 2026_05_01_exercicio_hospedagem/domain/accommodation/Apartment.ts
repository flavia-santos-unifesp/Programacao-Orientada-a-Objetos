import { Accommodation } from "./Accommodation"

// Apartamento tem outra regra de preço

export class Apartment implements Accommodation {
  constructor(
    public id: string,
    private pricePerDay: number
  ) {}

  calculatePrice(days: number): number {
    const base = this.pricePerDay * days

    // taxa de condomínio proporcional
    const condoFee = base * 0.1

    return base + condoFee
  }
}