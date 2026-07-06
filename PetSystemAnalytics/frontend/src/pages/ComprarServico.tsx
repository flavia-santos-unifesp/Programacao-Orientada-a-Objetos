import { useEffect, useState } from "react";
import { ServicoAgendamentoModal } from "../components/ServicoAgendamentoModal";
import { fetchAPI } from "../services/api";
import type { ClienteResponse, PetResponse, TipoServico, VendaResponse } from "../types";

const SERVICOS_INFO: Record<TipoServico, { nome: string; precoBase: number; duracao: number }> = {
  BANHO: { nome: "Banho", precoBase: 60, duracao: 45 },
  TOSA: { nome: "Tosa", precoBase: 80, duracao: 60 },
  CONSULTA: { nome: "Consulta Veterinária", precoBase: 120, duracao: 30 },
  HOSPEDAGEM: { nome: "Hospedagem", precoBase: 100, duracao: 1440 },
};

interface PrecoServicoResponse {
  preco: number;
  duracao: number;
}

interface ItemAgendado {
  servico: TipoServico;
  petId: number;
  petNome: string;
  funcionarioId: number;
  funcionarioNome: string;
  dataHora: string;
  duracao: number;
  preco: number;
}

export function ComprarServico() {
  const [clienteId, setClienteId] = useState<string>("");
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [pets, setPets] = useState<PetResponse[]>([]);

  const [tipoServicoSelecionado, setTipoServicoSelecionado] = useState<TipoServico | null>(null);
  const [petSelecionado, setPetSelecionado] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [servicosCalculados, setServicosCalculados] = useState(SERVICOS_INFO);
  const [carregandoPrecos, setCarregandoPrecos] = useState(false);

  const [itensAgendados, setItensAgendados] = useState<ItemAgendado[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetchAPI<ClienteResponse[]>("/clientes").then(setClientes).catch(console.error);
  }, []);

  useEffect(() => {
    if (clienteId) {
      fetchAPI<PetResponse[]>("/pets")
        .then((allPets) => {
          const petsCliente = allPets.filter((p) => p.clienteId === parseInt(clienteId));
          setPets(petsCliente);
          // Evita manter pet selecionado de outro cliente
          setPetSelecionado("");
        })
        .catch(console.error);
    } else {
      setPets([]);
      setPetSelecionado("");
    }
  }, [clienteId]);

  useEffect(() => {
    const carregarPrecosServicos = async () => {
      if (!petSelecionado) {
        setServicosCalculados(SERVICOS_INFO);
        return;
      }

      try {
        setCarregandoPrecos(true);

        const tipos = ["BANHO", "TOSA", "CONSULTA", "HOSPEDAGEM"] as TipoServico[];
        const respostas = await Promise.all(
          tipos.map(async (tipo) => {
            const dados = await fetchAPI<PrecoServicoResponse>(
              `/servicos/preco/${petSelecionado}/${tipo}`
            );

            return {
              tipo,
              preco: dados.preco,
              duracao: dados.duracao,
            };
          })
        );

        const calculado: Record<TipoServico, { nome: string; precoBase: number; duracao: number }> = {
          BANHO: { ...SERVICOS_INFO.BANHO },
          TOSA: { ...SERVICOS_INFO.TOSA },
          CONSULTA: { ...SERVICOS_INFO.CONSULTA },
          HOSPEDAGEM: { ...SERVICOS_INFO.HOSPEDAGEM },
        };

        for (const item of respostas) {
          calculado[item.tipo] = {
            ...calculado[item.tipo],
            precoBase: item.preco,
            duracao: item.duracao,
          };
        }

        setServicosCalculados(calculado);
      } catch (error) {
        console.error("Erro ao calcular preços dos serviços:", error);
        setServicosCalculados(SERVICOS_INFO);
      } finally {
        setCarregandoPrecos(false);
      }
    };

    carregarPrecosServicos();
  }, [petSelecionado]);

  const handleAdicionarServico = (tipoServico: TipoServico) => {
    setTipoServicoSelecionado(tipoServico);
    setShowModal(true);
  };

  const handleConfirmarAgendamento = async (funcionarioId: number, dataHora: string) => {
    try {
      if (!petSelecionado) {
        alert("Selecione um pet para finalizar o agendamento");
        return;
      }

      if (!tipoServicoSelecionado) {
        alert("Selecione um serviço para finalizar o agendamento");
        return;
      }

      const pet = pets.find((p) => p.id === parseInt(petSelecionado));
      if (!pet) {
        alert("Pet selecionado não encontrado. Selecione novamente.");
      return;
      }

      const info = servicosCalculados[tipoServicoSelecionado];

      // Buscar nome do funcionário
      const funcionarios = await fetchAPI<any[]>("/funcionarios");
      const funcionario = funcionarios.find((f) => f.id === funcionarioId);

      const novoItem: ItemAgendado = {
        servico: tipoServicoSelecionado,
        petId: pet.id,
        petNome: pet.nome,
        funcionarioId,
        funcionarioNome: funcionario?.nome || "Desconhecido",
        dataHora,
        duracao: info.duracao,
        preco: info.precoBase,
      };

      setItensAgendados([...itensAgendados, novoItem]);
      setTipoServicoSelecionado(null);
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao confirmar agendamento:", err);
      setErro("Erro ao confirmar agendamento");
    }
  };

  const handleFinalizarVenda = async () => {
    try {
      if (!clienteId || itensAgendados.length === 0) {
        alert("Selecione um cliente e adicione serviços");
        return;
      }

      setLoading(true);
      setErro(null);

      // Criar venda
      const venda = await fetchAPI<VendaResponse>("/vendas", {
        method: "POST",
        body: JSON.stringify({
          clienteId: parseInt(clienteId),
          itens: itensAgendados.map((item) => ({
            tipo: "SERVICO",
            servico: item.servico,
            petId: item.petId,
            quantidade: 1,
            precoUnitario: item.preco,
            dataHora: new Date(item.dataHora).toISOString(),
            funcionarioId: item.funcionarioId,
            duracao: item.duracao,
          })),
        }),
      });

      alert(`Venda #${venda.id} criada com sucesso!`);
      setClienteId("");
      setPets([]);
      setItensAgendados([]);
    } catch (err: any) {
      console.error("Erro ao finalizar venda:", err);
      setErro(err?.message || "Erro ao criar venda");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = itensAgendados.reduce((acc, item) => acc + item.preco, 0);

  const inputStyle: React.CSSProperties = {
    padding: "0.6rem",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    fontFamily: "var(--sans)",
    fontSize: "0.95rem",
    color: "var(--text)",
    background: "var(--bg)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ color: "var(--text-h)", fontSize: "1.5rem", margin: 0 }}>
      Comprar Serviço com Agendamento
      </h1>

      {erro && (
        <div style={{ background: "#fee", border: "1px solid red", padding: "0.75rem", borderRadius: "4px", color: "red" }}>
        {erro}
        </div>
      )}

      {/* Seleção de Cliente e Pet */}
      <div
        style={{
          background: "var(--bg)",
          padding: "1.5rem",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ color: "var(--text-h)", margin: "0 0 1rem", fontSize: "1.25rem" }}>1. Cliente e Pet</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.4rem" }}>
              Cliente
            </label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
            >
              <option value="">Selecione um cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.4rem" }}>
              Pet
            </label>
            <select
              value={petSelecionado}
              onChange={(e) => setPetSelecionado(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
              disabled={!clienteId}
            >
              <option value="">Selecione um pet...</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Seleção de Serviço */}
      <div
        style={{
          background: "var(--bg)",
          padding: "1.5rem",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ color: "var(--text-h)", margin: "0 0 1rem", fontSize: "1.25rem" }}>2. Selecione um Serviço</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {(["BANHO", "TOSA", "CONSULTA", "HOSPEDAGEM"] as TipoServico[]).map((tipo) => {
            const info = servicosCalculados[tipo];
            return (
              <button
                key={tipo}
                onClick={() => handleAdicionarServico(tipo)}
                style={{
                  padding: "1rem",
                  background: tipoServicoSelecionado === tipo ? "var(--accent)" : "var(--code-bg)",
                  color: "black",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  textAlign: "left",
                  transition: "background 0.2s",
                }}
              >
                <div>{info.nome}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                  {carregandoPrecos && petSelecionado
                    ? "Calculando..."
                    : `R$ ${info.precoBase.toFixed(2)}`}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "0.25rem" }}>
                {Math.floor(info.duracao / 60)}h {info.duracao % 60}m
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Serviços Agendados */}
      {itensAgendados.length > 0 && (
        <div
          style={{
            background: "var(--bg)",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <h2 style={{ color: "var(--text-h)", margin: "0 0 1rem" }}>3. Serviços Agendados</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {itensAgendados.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--code-bg)",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ color: "white", fontWeight: "600" }}>
                    {servicosCalculados[item.servico].nome} - {item.petNome}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    👤 {item.funcionarioNome} | 📅{" "}
                    {new Date(item.dataHora).toLocaleString("pt-BR")}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ color: "white", fontWeight: "600" }}>
                    R$ {item.preco.toFixed(2)}
                  </div>
                  <button
                    onClick={() => setItensAgendados(itensAgendados.filter((_, i) => i !== idx))}
                    style={{
                      background: "#fee",
                      color: "red",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.3rem 0.6rem",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totais */}
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
              textAlign: "right",
            }}
          >
            <div style={{ color: "var(--text)", marginBottom: "0.25rem" }}>
              Subtotal: <strong>R$ {subtotal.toFixed(2)}</strong>
            </div>
            <div style={{ color: "var(--text-h)", fontSize: "1.1rem" }}>
              Total: <strong>R$ {subtotal.toFixed(2)}</strong>
            </div>
          </div>

          {/* Finalizar */}
          <button
            onClick={handleFinalizarVenda}
            disabled={loading}
            style={{
              marginTop: "1rem",
              width: "100%",
              padding: "0.8rem",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "Processando..." : "✅ Finalizar Venda"}
          </button>
        </div>
      )}

      {/* Modal de Agendamento */}
      {showModal && tipoServicoSelecionado && (
        <ServicoAgendamentoModal
          tipoServico={tipoServicoSelecionado}
          duracao={servicosCalculados[tipoServicoSelecionado].duracao}
          petSelecionado={Boolean(petSelecionado)}
          onConfirm={handleConfirmarAgendamento}
          onCancel={() => {
            setShowModal(false);
            setTipoServicoSelecionado(null);
          }}
        />
      )}
    </div>
  );
}
