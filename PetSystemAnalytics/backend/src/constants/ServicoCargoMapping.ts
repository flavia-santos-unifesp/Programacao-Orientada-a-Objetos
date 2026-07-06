import { TipoServico } from "../models/service-types/TipoServico";

/**
 * Mapeia cada tipo de serviço para o(s) cargo(s) de funcionário capaz(es) de executá-lo.
 * 
 * Regras de negócio:
 * - Consulta: Apenas Veterinário
 * - Banho: Banho e Tosa (ou Gerente)
 * - Tosa: Banho e Tosa (ou Gerente)
 * - Hospedagem: Gerente ou Recepcionista
 */
export const SERVICO_CARGO_MAPPING: Record<TipoServico, string[]> = {
  [TipoServico.CONSULTA]: ["Veterinário"],
  [TipoServico.BANHO]: ["Banho e Tosa", "Gerente"],
  [TipoServico.TOSA]: ["Banho e Tosa", "Gerente"],
  [TipoServico.HOSPEDAGEM]: ["Gerente", "Recepcionista"],
};

/**
 * Retorna os cargos necessários para executar um serviço.
 */
export function getCargosParaServico(tipoServico: TipoServico): string[] {
  return SERVICO_CARGO_MAPPING[tipoServico] || [];
}
