import { Accommodation } from "./Accommodation"

// Representa uma casa
// Implementa a interface, então é obrigada a ter calculatePrice

export class House implements Accommodation {
  constructor(
    public id: string,
    private pricePerDay: number
  ) {}

  calculatePrice(days: number): number {
    // preço base
    const base = this.pricePerDay * days

    // regra específica de casa: taxa fixa de limpeza
    const cleaningFee = 100

    return base + cleaningFee
  }
}