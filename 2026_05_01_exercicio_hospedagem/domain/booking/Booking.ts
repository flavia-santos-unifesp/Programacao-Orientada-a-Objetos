import { Accommodation } from "../accommodation/Accommodation"
import { PricingService } from "../service/PricingService"

// Entidade de reserva
// Guarda dados e delega responsabilidades

export class Booking {
  public basePrice: number
  public totalPrice: number

  constructor(
    public accommodation: Accommodation,
    public days: number,
    pricingService: PricingService
  ) {
    // delega o cálculo para a acomodação
    this.basePrice = accommodation.calculatePrice(days)

    // aplica taxas usando o serviço
    this.totalPrice = pricingService.applyFees(this.basePrice)
  }
}