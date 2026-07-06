import { useEffect, useState } from "react";
import { ClienteForm } from "../components/ClienteForm";
import { ClienteList } from "../components/ClienteList";
import type { ClienteResponse } from "../types";
import { fetchAPI } from "../services/api";

export function Clientes() {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar clientes do backend
  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const data = await fetchAPI<ClienteResponse[]>("/clientes");
        setClientes(data);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar clientes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarClientes();
  }, []);

  const handleAddCliente = async (data: any) => {
    try {
      const novoCliente = await fetchAPI<ClienteResponse>("/clientes", {
        method: "POST",
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
        }),
      });
      setClientes([...clientes, novoCliente]);
      setError(null);
    } catch (err) {
      setError("Erro ao adicionar cliente");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "1.5rem", margin: 0 }}>
        Gestão de Clientes
      </h1>
      {error && <div style={{ color: "red", padding: "0.5rem" }}>{error}</div>}
      {loading ? <p>Carregando...</p> : <ClienteForm onSubmit={handleAddCliente} />}
      {loading ? <p>Carregando...</p> : <ClienteList clientes={clientes} />}
    </div>
  );
}