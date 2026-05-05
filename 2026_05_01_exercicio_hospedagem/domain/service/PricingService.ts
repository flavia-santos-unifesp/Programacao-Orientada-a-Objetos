import { Fee } from "../fee/Fee"

// Serviço responsável por aplicar taxas
// Não sabe nada sobre tipo de acomodação (isso é importante)

export class PricingService {
  constructor(private fees: Fee[]) {}

  applyFees(amount: number): number {
    // começa com o valor base
    return this.fees.reduce((total, fee) => {
      // cada taxa adiciona algo
      return total + fee.calculate(amount)
    }, amount)
  }
}