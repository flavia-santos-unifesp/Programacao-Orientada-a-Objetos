import { useState } from "react";
import { VendaForm } from "../components/VendaForm";
import { VendaList } from "../components/VendaList";
import type { VendaResponse, CreateVendaDTO } from "../types";
import { mockVendas } from "../data/mockData";

export function Vendas() {
  const [vendas, setVendas] = useState<VendaResponse[]>(mockVendas);

  const handleAddVenda = (data: CreateVendaDTO) => {
    const novaVenda: VendaResponse = {
      id: Math.max(...vendas.map(v => v.id), 0) + 1,
      clienteId: data.clienteId,
      cliente: { id: data.clienteId, nome: "Cliente", telefone: "", email: "", pontosFidelidade: 0, nivelFidelidade: "BRONZE" },
      data: new Date().toISOString(),
      itens: [],
      subtotal: 0,
      desconto: 0,
      total: 0
    };
    setVendas([...vendas, novaVenda]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "2.25rem", margin: 0 }}>
        🛒 Gestão de Vendas
      </h1>
      <VendaForm onSubmit={handleAddVenda} />
      <VendaList vendas={vendas} />
    </div>
  );
}