import { Fee } from "./Fee"

// Taxa fixa adicional
// Aqui eu ignorei o amount de propósito

export class CleaningFee implements Fee {
  calculate(): number {
    return 50
  }
}