import { useEffect, useState } from "react";
import type { ClienteResponse, CreatePetDTO, Especie, Porte } from "../types";
import { fetchAPI } from "../services/api";

interface PetFormProps {
  clienteId?: number;
  onSubmit: (data: CreatePetDTO) => void;
}

export function PetForm({ clienteId, onSubmit }: PetFormProps) {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [formData, setFormData] = useState<Partial<CreatePetDTO>>({
    nome: "",
    especie: "CACHORRO",
    raca: "",
    idade: 0,
    peso: 0,
    porte: "PEQUENO",
    clienteId: clienteId || 0,
  });

  useEffect(() => {
    fetchAPI<ClienteResponse[]>("/clientes")
      .then(setClientes)
      .catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteId) {
      alert("Selecione um cliente");
      return;
    }
    onSubmit(formData as CreatePetDTO);
    setFormData({
      nome: "",
      especie: "CACHORRO",
      raca: "",
      idade: 0,
      peso: 0,
      porte: "PEQUENO",
      clienteId: clienteId || 0,
    });
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    fontFamily: "var(--sans)",
    fontSize: "1rem",
    color: "var(--text)",
    background: "var(--bg)",
    width: "100%",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "var(--bg)",
      padding: "1.5rem",
      borderRadius: "8px",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow)"
    }}>
      <h2 style={{ color: "var(--text-h)", marginBottom: "1rem", fontSize: "1.25rem" }}>Novo Pet</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Cliente</label>
        <select
          value={formData.clienteId || ""}
          onChange={(e) => setFormData({ ...formData, clienteId: parseInt(e.target.value) })}
          style={{ padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "4px", fontFamily: "var(--sans)", fontSize: "1rem", color: "var(--text)", background: "var(--bg)", width: "100%" }}
          required
        >
          <option value="">Selecione um cliente...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Nome</label>
          <input
            type="text"
            value={formData.nome || ""}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Espécie</label>
          <select
            value={formData.especie || "CACHORRO"}
            onChange={(e) => setFormData({ ...formData, especie: e.target.value as Especie })}
            style={selectStyle}
            required
          >
            <option>CACHORRO</option>
            <option>GATO</option>
            <option>AVE</option>
            <option>PEIXE</option>
            <option>ROEDOR</option>
            <option>REPTIL</option>
            <option>OUTRO</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Raça</label>
          <input
            type="text"
            value={formData.raca || ""}
            onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Porte</label>
          <select
            value={formData.porte || "PEQUENO"}
            onChange={(e) => setFormData({ ...formData, porte: e.target.value as Porte })}
            style={selectStyle}
            required
          >
            <option>PEQUENO</option>
            <option>MEDIO</option>
            <option>GRANDE</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Idade (anos)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={formData.idade || 0}
            onChange={(e) => setFormData({ ...formData, idade: parseFloat(e.target.value) })}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Peso (kg)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={formData.peso || 0}
            onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) })}
            style={inputStyle}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        style={{
          background: "var(--accent)",
          color: "white",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "600",
          transition: "opacity 0.2s"
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Cadastrar Pet
      </button>
    </form>
  );
}