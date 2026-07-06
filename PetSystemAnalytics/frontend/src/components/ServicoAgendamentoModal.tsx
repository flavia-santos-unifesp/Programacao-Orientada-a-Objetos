import { useEffect, useState } from "react";
import { fetchAPI } from "../services/api";
import type { TipoServico } from "../types";

export interface FuncionarioDisponivel {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
}

interface ServicoAgendamentoModalProps {
  tipoServico: TipoServico;
  duracao: number;
  onConfirm: (funcionarioId: number, dataHora: string) => void;
  onCancel: () => void;
}

export function ServicoAgendamentoModal({
  tipoServico,
  duracao,
  onConfirm,
  onCancel,
}: ServicoAgendamentoModalProps) {
  const [dataHora, setDataHora] = useState<string>("");
  const [funcionarios, setFuncionarios] = useState<FuncionarioDisponivel[]>([]);
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Buscar funcionários quando data/hora mudar
  useEffect(() => {
    if (!dataHora) {
      setFuncionarios([]);
      return;
    }

    const carregarFuncionarios = async () => {
      try {
        setLoading(true);
        setErro(null);
        const url = `/agendamentos/disponibilidade/${tipoServico}?dataHora=${encodeURIComponent(dataHora)}&duracao=${duracao}`;
        const dados = await fetchAPI<FuncionarioDisponivel[]>(url);
        setFuncionarios(dados);
        
        if (dados.length === 0) {
          setErro("Nenhum funcionário disponível neste horário");
        }
      } catch (err) {
        console.error("Erro ao buscar disponibilidade:", err);
        setErro("Erro ao verificar disponibilidade");
        setFuncionarios([]);
      } finally {
        setLoading(false);
      }
    };

    carregarFuncionarios();
  }, [dataHora, duracao, tipoServico]);

  const handleConfirm = () => {
    if (!dataHora || !selecionado) {
      alert("Selecione data/hora e funcionário");
      return;
    }
    onConfirm(selecionado, dataHora);
  };

  // Calcula data/hora mínima (próxima hora cheia)
  const agora = new Date();
  agora.setHours(agora.getHours() + 1, 0, 0, 0);
  const minDateTime = agora.toISOString().slice(0, 16);

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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "var(--shadow)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "var(--text-h)", margin: "0 0 1rem" }}>
          📅 Agendar {tipoServico}
        </h2>

        {/* Data/Hora */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", color: "var(--text)", marginBottom: "0.4rem" }}>
            Data e Hora
          </label>
          <input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => {
              setDataHora(e.target.value);
              setSelecionado(null); // Reset quando mudar data
            }}
            min={minDateTime}
            style={{ ...inputStyle, width: "100%" }}
          />
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.3rem 0 0" }}>
            ⏰ Horário comercial: 8h-17h (seg-sex)
          </p>
        </div>

        {/* Funcionários Disponíveis */}
        {dataHora && (
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "var(--text)", marginBottom: "0.4rem" }}>
              Funcionário Disponível
            </label>
            {loading && <p style={{ color: "var(--text-muted)" }}>Carregando...</p>}
            {erro && <p style={{ color: "red", fontSize: "0.9rem" }}>{erro}</p>}
            {funcionarios.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {funcionarios.map((func) => (
                  <label
                    key={func.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.75rem",
                      border: `2px solid ${
                        selecionado === func.id ? "var(--accent)" : "var(--border)"
                      }`,
                      borderRadius: "4px",
                      cursor: "pointer",
                      background:
                        selecionado === func.id
                          ? "var(--accent-bg)"
                          : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="funcionario"
                      value={func.id}
                      checked={selecionado === func.id}
                      onChange={() => setSelecionado(func.id)}
                      style={{ marginRight: "0.75rem" }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: "var(--text-h)" }}>{func.nome}</strong>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.85rem",
                          margin: "0.2rem 0 0",
                        }}
                      >
                        {func.cargo}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "0.6rem 1.5rem",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text)",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!dataHora || !selecionado || loading}
            style={{
              padding: "0.6rem 1.5rem",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: !dataHora || !selecionado || loading ? 0.5 : 1,
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
