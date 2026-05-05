import { AccommodationRepository } from "../../infra/repositories/AccommodationRepository"
import { PricingService } from "../../domain/service/PricingService"
import { Booking } from "../../domain/booking/Booking"

// Entrada do caso de uso
type Input = {
  accommodationId: string
  days: number
}

// Caso de uso = orquestra o fluxo
// Não contém regra de negócio pesada

export class CreateBooking {
  constructor(
    private repo: AccommodationRepository,
    private pricingService: PricingService
  ) {}

  execute(input: Input): Booking {
    // busca acomodação
    const accommodation = this.repo.findById(input.accommodationId)

    // cria reserva
    return new Booking(
      accommodation,
      input.days,
      this.pricingService
    )
  }
}