// Interface base para qualquer tipo de acomodação.
// A ideia é que todas tenham esse comportamento em comum.

export interface Accommodation {
  id: string

  // Cada tipo de acomodação calcula seu preço do seu jeito.
  // Isso é o que permite usar polimorfismo.
  calculatePrice(days: number): number
}