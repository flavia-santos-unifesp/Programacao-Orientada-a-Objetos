// Esse arquivo só serve pra testar o sistema funcionando

import { House } from "./domain/accommodation/House"
import { Apartment } from "./domain/accommodation/Apartment"
import { SharedRoom } from "./domain/accommodation/SharedRoom"

import { PlatformFee } from "./domain/fee/PlatformFee"
import { ServiceFee } from "./domain/fee/ServiceFee"
import { CleaningFee } from "./domain/fee/CleaningFee"

import { PricingService } from "./domain/service/PricingService"

import { InMemoryAccommodationRepository } from "./infra/repositories/InMemoryAccommodationRepository"

import { CreateBooking } from "./application/use-cases/CreateBooking"

// cria repositório
const repo = new InMemoryAccommodationRepository()

// adiciona dados fake
repo.add(new House("1", 200))
repo.add(new Apartment("2", 150))
repo.add(new SharedRoom("3", 80))

// define taxas
const pricingService = new PricingService([
  new PlatformFee(),
  new ServiceFee(),
  new CleaningFee()
])

// cria caso de uso
const createBooking = new CreateBooking(repo, pricingService)

// executa
const booking = createBooking.execute({
  accommodationId: "1",
  days: 3
})

// resultado
console.log("Base:", booking.basePrice)
console.log("Total:", booking.totalPrice)