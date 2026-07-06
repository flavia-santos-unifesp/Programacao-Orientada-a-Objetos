import { AgendamentoRepository } from "../repositories/AgendamentoRepository";
import { FuncionarioRepository } from "../repositories/FuncionarioRepository";
import { CreateAgendamentoDTO } from "../dto/CreateAgendamentoDTO";
import { Agendamento } from "../models/Agendamento";

export class AgendamentoService {

    constructor(
        private agendamentoRepository: AgendamentoRepository,
        private funcionarioRepository: FuncionarioRepository
    ) {}

    /**
     * Verifica se um funcionário tem disponibilidade em um intervalo de tempo.
     */
    public async verificarDisponibilidade(
        funcionarioId: number,
        dataHora: Date,
        duracao: number
    ): Promise<boolean> {

        const funcionario = await this.funcionarioRepository.findById(funcionarioId);

        if (!funcionario) {
            throw new Error("Funcionário não encontrado.");
        }

        const dataFim = new Date(dataHora);
        dataFim.setMinutes(dataFim.getMinutes() + duracao);

        // Busca agendamentos que se sobrepõem ao período solicitado
        const agendamentosConflitantes = await this.agendamentoRepository.findByFuncionarioAndPeriodo(
            funcionarioId,
            dataHora,
            dataFim
        );

        // Verifica se há conflitos reais (sobreposição de tempo)
        for (const agendamento of agendamentosConflitantes) {
            const agendamentoFim = agendamento.getDataHoraFim();
            const agendamentoInicio = agendamento.getDataHora();

            // Verifica sobreposição: dataHora < agendamentoFim && dataFim > agendamentoInicio
            if (dataHora < agendamentoFim && dataFim > agendamentoInicio) {
                return false;
            }
        }

        return true;

    }

    /**
     * Cria um agendamento após validar disponibilidade.
     */
    public async agendar(dto: CreateAgendamentoDTO): Promise<Agendamento> {

        const disponivel = await this.verificarDisponibilidade(
            dto.funcionarioId,
            dto.dataHora,
            dto.duracao
        );

        if (!disponivel) {
            throw new Error("Funcionário não está disponível neste horário.");
        }

        return await this.agendamentoRepository.create(dto);

    }

    /**
     * Lista agendamentos de um funcionário em uma data específica.
     */
    public async listarPorFuncionarioEData(
        funcionarioId: number,
        data: Date
    ): Promise<Agendamento[]> {

        const dataInicio = new Date(data);
        dataInicio.setHours(0, 0, 0, 0);

        const dataFim = new Date(data);
        dataFim.setHours(23, 59, 59, 999);

        return await this.agendamentoRepository.findByFuncionarioAndPeriodo(
            funcionarioId,
            dataInicio,
            dataFim
        );

    }

    /**
     * Confirma um agendamento.
     */
    public async confirmarAgendamento(agendamentoId: number): Promise<Agendamento> {

        const agendamento = await this.agendamentoRepository.findById(agendamentoId);

        if (!agendamento) {
            throw new Error("Agendamento não encontrado.");
        }

        agendamento.confirmar();

        // Aqui você atualizaria no banco se tivesse método update no repository
        return agendamento;

    }
}
