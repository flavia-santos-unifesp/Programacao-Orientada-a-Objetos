import { describe, it, expect } from "vitest";
import { Agendamento } from "../models/Agendamento";
import { Funcionario } from "../models/Funcionario";
import { ItemVenda } from "../models/ItemVenda";
import { StatusAgendamento } from "../models/StatusAgendamento";

describe("Agendamento", () => {
  let funcionario: Funcionario;
  let itemVenda: ItemVenda;

  beforeEach(() => {
    funcionario = new Funcionario(
      1,
      "Dr. João",
      "(11) 99999-9999",
      "joao@email.com",
      "Veterinário"
    );

    itemVenda = new ItemVenda(
      1,
      "SERVICO",
      1,
      150.0
    );
  });

  it("deve criar um agendamento válido", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    const agendamento = new Agendamento(
      1,
      dataHora,
      60,
      StatusAgendamento.PENDENTE,
      funcionario,
      itemVenda
    );

    expect(agendamento.getId()).toBe(1);
    expect(agendamento.getDuracao()).toBe(60);
    expect(agendamento.getStatus()).toBe(StatusAgendamento.PENDENTE);
    expect(agendamento.getFuncionario().getNome()).toBe("Dr. João");
  });

  it("deve lançar erro se dataHora estiver vazia", () => {
    expect(() => {
      new Agendamento(1, null as any, 60, StatusAgendamento.PENDENTE, funcionario, itemVenda);
    }).toThrow("Data e hora do agendamento são obrigatórios");
  });

  it("deve lançar erro se duracao for inválida", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    expect(() => {
      new Agendamento(1, dataHora, 0, StatusAgendamento.PENDENTE, funcionario, itemVenda);
    }).toThrow("Duração deve ser maior que zero");
  });

  it("deve lançar erro se funcionario for nulo", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    expect(() => {
      new Agendamento(1, dataHora, 60, StatusAgendamento.PENDENTE, null as any, itemVenda);
    }).toThrow("Funcionário é obrigatório");
  });

  it("deve lançar erro se itemVenda for nulo", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    expect(() => {
      new Agendamento(1, dataHora, 60, StatusAgendamento.PENDENTE, funcionario, null as any);
    }).toThrow("ItemVenda é obrigatório");
  });

  it("deve calcular corretamente a data/hora de fim", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    const agendamento = new Agendamento(
      1,
      dataHora,
      90,
      StatusAgendamento.PENDENTE,
      funcionario,
      itemVenda
    );

    const dataFim = agendamento.getDataHoraFim();
    expect(dataFim.getHours()).toBe(11);
    expect(dataFim.getMinutes()).toBe(30);
  });

  it("deve confirmar um agendamento pendente", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    const agendamento = new Agendamento(
      1,
      dataHora,
      60,
      StatusAgendamento.PENDENTE,
      funcionario,
      itemVenda
    );

    agendamento.confirmar();
    expect(agendamento.getStatus()).toBe(StatusAgendamento.CONFIRMADO);
  });

  it("deve lançar erro ao confirmar agendamento não pendente", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    const agendamento = new Agendamento(
      1,
      dataHora,
      60,
      StatusAgendamento.CONFIRMADO,
      funcionario,
      itemVenda
    );

    expect(() => {
      agendamento.confirmar();
    }).toThrow("Apenas agendamentos pendentes podem ser confirmados");
  });

  it("deve concluir um agendamento confirmado", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    const agendamento = new Agendamento(
      1,
      dataHora,
      60,
      StatusAgendamento.CONFIRMADO,
      funcionario,
      itemVenda
    );

    agendamento.concluir();
    expect(agendamento.getStatus()).toBe(StatusAgendamento.REALIZADO);
  });

  it("deve lançar erro ao concluir agendamento não confirmado", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    const agendamento = new Agendamento(
      1,
      dataHora,
      60,
      StatusAgendamento.PENDENTE,
      funcionario,
      itemVenda
    );

    expect(() => {
      agendamento.concluir();
    }).toThrow("Apenas agendamentos confirmados podem ser concluídos");
  });

  it("deve cancelar um agendamento pendente", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    const agendamento = new Agendamento(
      1,
      dataHora,
      60,
      StatusAgendamento.PENDENTE,
      funcionario,
      itemVenda
    );

    agendamento.cancelar();
    expect(agendamento.getStatus()).toBe(StatusAgendamento.CANCELADO);
  });

  it("deve cancelar um agendamento confirmado", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    const agendamento = new Agendamento(
      1,
      dataHora,
      60,
      StatusAgendamento.CONFIRMADO,
      funcionario,
      itemVenda
    );

    agendamento.cancelar();
    expect(agendamento.getStatus()).toBe(StatusAgendamento.CANCELADO);
  });

  it("deve lançar erro ao cancelar agendamento realizado", () => {
    const dataHora = new Date("2026-07-10T10:00:00");
    const agendamento = new Agendamento(
      1,
      dataHora,
      60,
      StatusAgendamento.REALIZADO,
      funcionario,
      itemVenda
    );

    expect(() => {
      agendamento.cancelar();
    }).toThrow("Agendamentos realizados não podem ser cancelados");
  });
});

describe("Verificação de Conflitos", () => {
  it("não deve haver conflito se agendamentos não se sobrepõem (anterior)", () => {
    // Agendamento 1: 10:00-11:00
    const ag1Inicio = new Date("2026-07-10T10:00:00");
    const ag1Fim = new Date("2026-07-10T11:00:00");

    // Novo agendamento: 9:00-10:00
    const novoInicio = new Date("2026-07-10T09:00:00");
    const novoFim = new Date("2026-07-10T10:00:00");

    // Verificar: novoInicio < ag1Fim && novoFim > ag1Inicio
    const conflita = novoInicio < ag1Fim && novoFim > ag1Inicio;
    expect(conflita).toBe(false);
  });

  it("não deve haver conflito se agendamentos não se sobrepõem (posterior)", () => {
    // Agendamento 1: 10:00-11:00
    const ag1Inicio = new Date("2026-07-10T10:00:00");
    const ag1Fim = new Date("2026-07-10T11:00:00");

    // Novo agendamento: 11:00-12:00
    const novoInicio = new Date("2026-07-10T11:00:00");
    const novoFim = new Date("2026-07-10T12:00:00");

    // Verificar: novoInicio < ag1Fim && novoFim > ag1Inicio
    const conflita = novoInicio < ag1Fim && novoFim > ag1Inicio;
    expect(conflita).toBe(false);
  });

  it("deve haver conflito se novo agendamento sobrepõe início", () => {
    // Agendamento 1: 10:00-11:00
    const ag1Inicio = new Date("2026-07-10T10:00:00");
    const ag1Fim = new Date("2026-07-10T11:00:00");

    // Novo agendamento: 9:30-10:30
    const novoInicio = new Date("2026-07-10T09:30:00");
    const novoFim = new Date("2026-07-10T10:30:00");

    // Verificar: novoInicio < ag1Fim && novoFim > ag1Inicio
    const conflita = novoInicio < ag1Fim && novoFim > ag1Inicio;
    expect(conflita).toBe(true);
  });

  it("deve haver conflito se novo agendamento sobrepõe fim", () => {
    // Agendamento 1: 10:00-11:00
    const ag1Inicio = new Date("2026-07-10T10:00:00");
    const ag1Fim = new Date("2026-07-10T11:00:00");

    // Novo agendamento: 10:30-11:30
    const novoInicio = new Date("2026-07-10T10:30:00");
    const novoFim = new Date("2026-07-10T11:30:00");

    // Verificar: novoInicio < ag1Fim && novoFim > ag1Inicio
    const conflita = novoInicio < ag1Fim && novoFim > ag1Inicio;
    expect(conflita).toBe(true);
  });

  it("deve haver conflito se novo agendamento contém o existente", () => {
    // Agendamento 1: 10:00-11:00
    const ag1Inicio = new Date("2026-07-10T10:00:00");
    const ag1Fim = new Date("2026-07-10T11:00:00");

    // Novo agendamento: 9:00-12:00
    const novoInicio = new Date("2026-07-10T09:00:00");
    const novoFim = new Date("2026-07-10T12:00:00");

    // Verificar: novoInicio < ag1Fim && novoFim > ag1Inicio
    const conflita = novoInicio < ag1Fim && novoFim > ag1Inicio;
    expect(conflita).toBe(true);
  });

  it("deve haver conflito se novo agendamento está dentro do existente", () => {
    // Agendamento 1: 10:00-11:00
    const ag1Inicio = new Date("2026-07-10T10:00:00");
    const ag1Fim = new Date("2026-07-10T11:00:00");

    // Novo agendamento: 10:15-10:45
    const novoInicio = new Date("2026-07-10T10:15:00");
    const novoFim = new Date("2026-07-10T10:45:00");

    // Verificar: novoInicio < ag1Fim && novoFim > ag1Inicio
    const conflita = novoInicio < ag1Fim && novoFim > ag1Inicio;
    expect(conflita).toBe(true);
  });

  it("deve haver conflito se agendamentos são exatamente iguais", () => {
    // Agendamento 1: 10:00-11:00
    const ag1Inicio = new Date("2026-07-10T10:00:00");
    const ag1Fim = new Date("2026-07-10T11:00:00");

    // Novo agendamento: 10:00-11:00
    const novoInicio = new Date("2026-07-10T10:00:00");
    const novoFim = new Date("2026-07-10T11:00:00");

    // Verificar: novoInicio < ag1Fim && novoFim > ag1Inicio
    const conflita = novoInicio < ag1Fim && novoFim > ag1Inicio;
    expect(conflita).toBe(true);
  });
});
