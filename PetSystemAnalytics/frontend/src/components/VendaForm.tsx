import { useState } from "react";
import type { CreateVendaDTO } from "../types";

interface VendaFormProps {
  onSubmit: (data: CreateVendaDTO) => void;
}

export function VendaForm({ onSubmit }: VendaFormProps) {
  const [clienteId, setClienteId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteId) {
      alert("Selecione um cliente");
      return;
    }

    const venda: CreateVendaDTO = {
      clienteId: parseInt(clienteId),
      itens: []
    };

    onSubmit(venda);
    setClienteId("");
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

  return (
    <form onSubmit={handleSubmit} style={{
      background: "var(--bg)",
      padding: "1.5rem",
      borderRadius: "8px",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow)"
    }}>
      <h2 style={{ color: "var(--text-h)", marginBottom: "1rem" }}>Registrar Venda</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ display: "block", color: "var(--text)", marginBottom: "0.5rem" }}>Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            style={inputStyle}
            required
          >
            <option value="">Selecione um cliente...</option>
            <option value="1">João Silva</option>
            <option value="2">Maria Santos</option>
          </select>
        </div>
      </div>

      <p style={{
        color: "var(--text)",
        fontSize: "0.9rem",
        marginBottom: "1rem",
        fontStyle: "italic"
      }}>
        ℹ️ Funcionalidade completa em desenvolvimento. Em breve será possível adicionar itens e calcular totais.
      </p>

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
        Registrar Venda
      </button>
    </form>
  );
}