import { Fee } from "./Fee"

// Taxa da plataforma (tipo Airbnb)

export class PlatformFee implements Fee {
  calculate(amount: number): number {
    // porcentagem sobre o valor
    return amount * 0.0585
  }
}