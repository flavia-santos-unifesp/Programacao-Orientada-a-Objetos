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
  private static readonly UTC_MINUS3_OFFSET_HOURS = -3;

  private static toUtcMinus3Reference(dataHora: Date): Date {
    return new Date(
      dataHora.getTime() + this.UTC_MINUS3_OFFSET_HOURS * 60 * 60 * 1000
    );
  }

  private static fromUtcMinus3Reference(dataHora: Date): Date {
    return new Date(
      dataHora.getTime() - this.UTC_MINUS3_OFFSET_HOURS * 60 * 60 * 1000
    );
  }

  static getHoraUtcMinus3(dataHora: Date): number {
    const dataRef = this.toUtcMinus3Reference(dataHora);
    return dataRef.getUTCHours();
  }

  static getDiaSemanaUtcMinus3(dataHora: Date): number {
    const dataRef = this.toUtcMinus3Reference(dataHora);
    return dataRef.getUTCDay();
  }

  static formatDateUtcMinus3(dataHora: Date): string {
    const dataRef = this.toUtcMinus3Reference(dataHora);
    const ano = dataRef.getUTCFullYear();
    const mes = String(dataRef.getUTCMonth() + 1).padStart(2, "0");
    const dia = String(dataRef.getUTCDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  static parseDateUtcMinus3(
    data: string,
    hora: number = 0,
    minuto: number = 0
  ): Date | null {
    const [anoStr, mesStr, diaStr] = data.split("-");
    const ano = Number(anoStr);
    const mes = Number(mesStr);
    const dia = Number(diaStr);

    if (!Number.isFinite(ano) || !Number.isFinite(mes) || !Number.isFinite(dia)) {
      return null;
    }

    // Converte uma data/hora local UTC-3 para instant UTC real.
    const utcDate = new Date(Date.UTC(ano, mes - 1, dia, hora + 3, minuto, 0, 0));
    return utcDate;
  }

  /**
   * Verifica se a data/hora é um horário comercial válido.
   */
  static isHorarioComercial(dataHora: Date): boolean {
    const diaSemana = this.getDiaSemanaUtcMinus3(dataHora); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const hora = this.getHoraUtcMinus3(dataHora);

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
    const data = this.toUtcMinus3Reference(new Date(dataHora));
    data.setUTCMinutes(0);
    data.setUTCSeconds(0);
    data.setUTCMilliseconds(0);

    const agoraUtcMinus3 = this.toUtcMinus3Reference(new Date());

    // Se já passou de hoje, começa amanhã
    if (data <= agoraUtcMinus3) {
      data.setUTCDate(data.getUTCDate() + 1);
    }

    // Se é fora de horário comercial, ajusta para o horário de abertura
    if (data.getUTCHours() < this.HORA_ABERTURA) {
      data.setUTCHours(this.HORA_ABERTURA);
    }

    // Se é no fim de semana ou após o fechamento, vai para segunda-feira de manhã
    if (!this.isHorarioComercial(this.fromUtcMinus3Reference(data))) {
      const diaSemana = data.getUTCDay();
      
      if (diaSemana === 0) {
        // Domingo → segunda
        data.setUTCDate(data.getUTCDate() + 1);
        data.setUTCHours(this.HORA_ABERTURA);
      } else if (diaSemana === 6) {
        // Sábado → segunda
        data.setUTCDate(data.getUTCDate() + 2);
        data.setUTCHours(this.HORA_ABERTURA);
      } else if (data.getUTCHours() >= this.HORA_FECHAMENTO) {
        // Depois das 17h → próximo dia
        data.setUTCDate(data.getUTCDate() + 1);
        data.setUTCHours(this.HORA_ABERTURA);
      }
    }

    return this.fromUtcMinus3Reference(data);
  }
}
