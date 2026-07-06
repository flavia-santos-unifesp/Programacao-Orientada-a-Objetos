import { useState } from "react";
import type { CreateClienteDTO } from "../types";

interface ClienteFormProps {
  onSubmit: (data: CreateClienteDTO) => void;
}

export function ClienteForm({ onSubmit }: ClienteFormProps) {
  const [formData, setFormData] = useState<CreateClienteDTO>({
    nome: "",
    telefone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ nome: "", telefone: "", email: "" });
  };

  // Função para formatar telefone
  const formatTelefone = (value: string): string => {
    // Remove tudo que não é número
    const números = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    const limitado = números.slice(0, 11);

    // Aplica a máscara
    if (limitado.length === 0) return "";
    if (limitado.length <= 2) return `(${limitado}`;
    if (limitado.length <= 7) return `(${limitado.slice(0, 2)}) ${limitado.slice(2)}`;
    return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 7)}-${limitado.slice(7)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const telefoneFormatado = formatTelefone(valor);
    setFormData({ ...formData, telefone: telefoneFormatado });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    fontFamily: "var(--sans)",
    fontSize: "1rem",
    color: "var(--text)",
    background: "var(--bg)",
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "var(--bg)",
      padding: "1rem",
      borderRadius: "8px",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow)"
    }}>
      <h2 style={{ color: "var(--text-h)", marginBottom: "1rem", fontSize: "1.25rem" }}>Novo Cliente</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Nome</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          style={inputStyle}
          required
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Telefone</label>
        <input
          type="tel"
          value={formData.telefone}
          onChange={handleTelefoneChange}
          style={inputStyle}
          required
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={inputStyle}
          required
        />
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
        Cadastrar Cliente
      </button>
    </form>
  );
}