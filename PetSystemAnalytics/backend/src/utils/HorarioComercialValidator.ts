/**
 * Valida se uma data/hora está dentro do horário comercial.
 * 
 * Regras:
 * - Segunda à Sexta: 8h às 17h
 * - Fim de semana: Fechado
 * - Não valida se a data é no passado
 */
export class HorarioComercialValidator {
  
  private static readonly HORA_ABERTURA = 8; // 8:00
  private static readonly HORA_FECHAMENTO = 17; // 17:00
  private static readonly DIA_SEMANA_INICIO = 1; // Monday (0=Sunday)
  private static readonly DIA_SEMANA_FIM = 5; // Friday

  /**
   * Verifica se a data/hora é um horário comercial válido.
   */
  static isHorarioComercial(dataHora: Date): boolean {
    const data = new Date(dataHora);
    const diaSemana = data.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const hora = data.getHours();

    // Verifica se está em dia da semana (segunda-sexta)
    if (diaSemana < this.DIA_SEMANA_INICIO || diaSemana > this.DIA_SEMANA_FIM) {
      return false;
    }

    // Verifica se está dentro do horário (8h-17h)
    if (hora < this.HORA_ABERTURA || hora >= this.HORA_FECHAMENTO) {
      return false;
    }

    return true;
  }

  /**
   * Verifica se a data/hora é válida (não está no passado e dentro do horário comercial).
   */
  static isDataHoraValida(dataHora: Date): boolean {
    const agora = new Date();
    
    // Verifica se não é data passada
    if (dataHora <= agora) {
      return false;
    }

    return this.isHorarioComercial(dataHora);
  }

  /**
   * Retorna a próxima data/hora comercial válida a partir de uma data.
   * Útil para sugerir horários ao usuário.
   */
  static proximaDataComercial(dataHora: Date = new Date()): Date {
    const data = new Date(dataHora);
    data.setMinutes(0);
    data.setSeconds(0);
    data.setMilliseconds(0);

    // Se já passou de hoje, começa amanhã
    if (data <= new Date()) {
      data.setDate(data.getDate() + 1);
    }

    // Se é fora de horário comercial, ajusta para o horário de abertura
    if (data.getHours() < this.HORA_ABERTURA) {
      data.setHours(this.HORA_ABERTURA);
    }

    // Se é no fim de semana ou após o fechamento, vai para segunda-feira de manhã
    if (!this.isHorarioComercial(data)) {
      const diaSemana = data.getDay();
      
      if (diaSemana === 0) {
        // Domingo → segunda
        data.setDate(data.getDate() + 1);
        data.setHours(this.HORA_ABERTURA);
      } else if (diaSemana === 6) {
        // Sábado → segunda
        data.setDate(data.getDate() + 2);
        data.setHours(this.HORA_ABERTURA);
      } else if (data.getHours() >= this.HORA_FECHAMENTO) {
        // Depois das 17h → próximo dia
        data.setDate(data.getDate() + 1);
        data.setHours(this.HORA_ABERTURA);
      }
    }

    return data;
  }
}
