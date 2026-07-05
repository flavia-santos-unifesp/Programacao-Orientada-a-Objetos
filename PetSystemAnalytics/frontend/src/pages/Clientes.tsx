import { useState } from "react";
import { ClienteForm } from "../components/ClienteForm";
import { ClienteList } from "../components/ClienteList";
import type { ClienteResponse } from "../types";
import { mockClientes } from "../data/mockData";

export function Clientes() {
  const [clientes, setClientes] = useState<ClienteResponse[]>(mockClientes);

  const handleAddCliente = (data: any) => {
    const novoCliente: ClienteResponse = {
      ...data,
      id: Math.max(...clientes.map(c => c.id), 0) + 1,
      pontosFidelidade: 0,
      nivelFidelidade: "BRONZE" as const,
    };
    setClientes([...clientes, novoCliente]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "2.25rem", margin: 0 }}>
        👥 Gestão de Clientes
      </h1>
      <ClienteForm onSubmit={handleAddCliente} />
      <ClienteList clientes={clientes} />
    </div>
  );
}