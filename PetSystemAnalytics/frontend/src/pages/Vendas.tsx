import { useEffect, useState } from "react";
import { VendaForm } from "../components/VendaForm";
import { VendaList } from "../components/VendaList";
import type { VendaResponse, CreateVendaDTO } from "../types";
import { fetchAPI } from "../services/api";

export function Vendas() {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar vendas do backend
  useEffect(() => {
    const carregarVendas = async () => {
      try {
        const data = await fetchAPI<VendaResponse[]>("/vendas");
        setVendas(data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar vendas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarVendas();
  }, []);

  const handleAddVenda = async (data: CreateVendaDTO) => {
    try {
      const novaVenda = await fetchAPI<VendaResponse>("/vendas", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setVendas([novaVenda, ...vendas]);
      setError(null);
    } catch (err) {
      setError("Erro ao adicionar venda");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "2.25rem", margin: 0 }}>
        🛒 Gestão de Vendas
      </h1>
      {error && <div style={{ color: "red", padding: "0.5rem" }}>{error}</div>}
      {loading ? <p>Carregando...</p> : <VendaForm onSubmit={handleAddVenda} />}
      {loading ? <p>Carregando...</p> : <VendaList vendas={vendas} />}
    </div>
  );
}