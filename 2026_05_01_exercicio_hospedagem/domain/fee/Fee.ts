// Interface para qualquer tipo de taxa
// A ideia é poder adicionar/remover taxas sem mexer no resto do sistema

export interface Fee {
  calculate(amount: number): number
}