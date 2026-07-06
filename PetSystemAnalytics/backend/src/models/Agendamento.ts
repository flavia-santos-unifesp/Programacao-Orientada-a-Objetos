import { ItemVenda } from "./ItemVenda";
import { Funcionario } from "./Funcionario";
import { StatusAgendamento } from "./StatusAgendamento";

export class Agendamento {
    constructor(
        private id: number,
        private dataHora: Date,
        private duracao: number,
        private status: StatusAgendamento,
        private funcionario: Funcionario,
        private itemVenda: ItemVenda
    ) {
        if (!dataHora) {
            throw new Error("Data e hora do agendamento são obrigatórios.");
        }

        if (duracao <= 0) {
            throw new Error("Duração deve ser maior que zero.");
        }

        if (!funcionario) {
            throw new Error("Funcionário é obrigatório.");
        }

        if (!itemVenda) {
            throw new Error("ItemVenda é obrigatório.");
        }
    }

    public getId(): number {
        return this.id;
    }

    public getDataHora(): Date {
        return this.dataHora;
    }

    public getDuracao(): number {
        return this.duracao;
    }

    public getStatus(): StatusAgendamento {
        return this.status;
    }

    public getFuncionario(): Funcionario {
        return this.funcionario;
    }

    public getItemVenda(): ItemVenda {
        return this.itemVenda;
    }

    public getDataHoraFim(): Date {
        const dataFim = new Date(this.dataHora);
        dataFim.setMinutes(dataFim.getMinutes() + this.duracao);
        return dataFim;
    }

    public confirmar(): void {
        if (this.status !== StatusAgendamento.PENDENTE) {
            throw new Error("Apenas agendamentos pendentes podem ser confirmados.");
        }
        this.status = StatusAgendamento.CONFIRMADO;
    }

    public concluir(): void {
        if (this.status !== StatusAgendamento.CONFIRMADO) {
            throw new Error("Apenas agendamentos confirmados podem ser concluídos.");
        }
        this.status = StatusAgendamento.REALIZADO;
    }

    public cancelar(): void {
        if (this.status === StatusAgendamento.REALIZADO) {
            throw new Error("Agendamentos realizados não podem ser cancelados.");
        }
        this.status = StatusAgendamento.CANCELADO;
    }
}
