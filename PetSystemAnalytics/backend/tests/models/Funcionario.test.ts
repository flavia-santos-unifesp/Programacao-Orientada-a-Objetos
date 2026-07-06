import { describe, it, expect } from "vitest";
import { Funcionario } from "../models/Funcionario";

describe("Funcionario", () => {
  it("deve criar um funcionário válido", () => {
    const funcionario = new Funcionario(
      1,
      "João Silva",
      "(11) 99999-9999",
      "joao@email.com",
      "Veterinário"
    );

    expect(funcionario.getId()).toBe(1);
    expect(funcionario.getNome()).toBe("João Silva");
    expect(funcionario.getTelefone()).toBe("(11) 99999-9999");
    expect(funcionario.getEmail()).toBe("joao@email.com");
    expect(funcionario.getCargo()).toBe("Veterinário");
  });

  it("deve herdar de Pessoa corretamente", () => {
    const funcionario = new Funcionario(
      2,
      "Maria Santos",
      "(11) 88888-8888",
      "maria@email.com",
      "Banho e Tosa"
    );

    // Verificar herança de Pessoa
    expect(funcionario.getId()).toBe(2);
    expect(funcionario.getNome()).toBe("Maria Santos");
    expect(funcionario.getTelefone()).toBe("(11) 88888-8888");
    expect(funcionario.getEmail()).toBe("maria@email.com");
  });

  it("deve permitir diferentes cargos", () => {
    const cargos = ["Gerente", "Veterinário", "Banho e Tosa", "Recepcionista"];
    
    cargos.forEach((cargo, index) => {
      const funcionario = new Funcionario(
        index,
        `Funcionário ${index}`,
        "(11) 99999-9999",
        `email${index}@example.com`,
        cargo
      );
      
      expect(funcionario.getCargo()).toBe(cargo);
    });
  });
});
