import { Fee } from "./Fee"

// Outra taxa percentual

export class ServiceFee implements Fee {
  calculate(amount: number): number {
    return amount * 0.1
  }
}