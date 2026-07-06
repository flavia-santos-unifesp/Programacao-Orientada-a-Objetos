/**
 * DTO para criar um agendamento durante a compra de um serviço.
 * 
 * O agendamento será criado APÓS a venda ser persistida,
 * vinculando o serviço ao ItemVenda correspondente.
 */
export interface CreateAgendamentoVendaDTO {
  
  /**
   * ID do funcionário designado para o serviço.
   */
  funcionarioId: number;

  /**
   * Data e hora do agendamento (ISO 8601 format: "2026-07-06T14:30:00").
   */
  dataHora: string;

  /**
   * Duração em minutos.
   */
  duracao: number;

  /**
   * ID do ItemVenda que este agendamento está associado.
   * (será preenchido após criar o ItemVenda)
   */
  itemVendaId: number;
}
