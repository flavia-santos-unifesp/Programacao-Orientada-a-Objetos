import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
}

interface Agendamento {
  id: number;
  dataHora: string;
  duracao: number;
  status: 'PENDENTE' | 'CONFIRMADO' | 'REALIZADO' | 'CANCELADO';
  funcionario: Funcionario;
  itemVenda?: {
    id: number;
    tipo: string;
    cliente: {
      nome: string;
      pet: {
        nome: string;
        especie: string;
      };
    };
  };
}

interface RelatorioAgendaData {
  periodoDe: string;
  periodoAte: string;
  totalAgendamentos: number;
  porStatus: Record<string, number>;
  porFuncionario: Array<{
    funcionarioId: number;
    funcionarioNome: string;
    cargo: string;
    total: number;
    porStatus: Record<string, number>;
    agendamentos: Agendamento[];
  }>;
}

export function Agenda() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [relatorio, setRelatorio] = useState<RelatorioAgendaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const data = await fetchAPI<Funcionario[]>('/funcionarios');
      setFuncionarios(data);
      if (data.length > 0) {
        setSelectedFuncionario(data[0].id);
      }
    } catch (err: any) {
      setError('Erro ao carregar funcionários.');
      console.error('Erro:', err);
    }
  };

  const carregarRelatorio = async () => {
    if (!selectedFuncionario || !startDate || !endDate) {
      setError('Selecione funcionário e período.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await fetchAPI<RelatorioAgendaData>(
        `/relatorios/agenda/funcionario/${selectedFuncionario}?dataInicio=${startDate}&dataFim=${endDate}`
      );
      setRelatorio(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar relatório.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const mudarStatus = async (agendamentoId: number, novoStatus: string) => {
    try {
      await fetchAPI(`/agendamentos/${agendamentoId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: novoStatus }),
      });
      await carregarRelatorio();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar status.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return '#ffc107'; // amarelo
      case 'CONFIRMADO':
        return '#17a2b8'; // azul
      case 'REALIZADO':
        return '#28a745'; // verde
      case 'CANCELADO':
        return '#dc3545'; // vermelho
      default:
        return '#6c757d'; // cinza
    }
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    background: 'linear-gradient(135deg, var(--bg) 0%, #f5f7fa 100%)',
    borderRadius: '12px',
  };

  const filterStyle: React.CSSProperties = {
    background: 'var(--bg)',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    marginBottom: '2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '1rem',
    alignItems: 'end',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    background: 'var(--input-bg)',
    color: 'var(--text)',
  };

  const buttonStyle: React.CSSProperties = {
    background: 'var(--accent)',
    color: 'white',
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const agendamentoStyle = (status: string): React.CSSProperties => ({
    background: `${getStatusColor(status)}20`,
    border: `2px solid ${getStatusColor(status)}`,
    borderLeft: `4px solid ${getStatusColor(status)}`,
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: '1rem',
    alignItems: 'center',
  });

  const statusBadgeStyle = (status: string): React.CSSProperties => ({
    background: getStatusColor(status),
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  });

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
  };

  const smallButtonStyle = (bg: string): React.CSSProperties => ({
    background: bg,
    color: 'white',
    padding: '0.4rem 0.8rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  });

  return (
    <div style={containerStyle}>
      <h1 style={{ color: 'var(--accent)', marginTop: 0 }}>📅 Agenda de Serviços</h1>

      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}

      <div style={filterStyle}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Funcionário:</label>
          <select
            value={selectedFuncionario || ''}
            onChange={(e) => setSelectedFuncionario(parseInt(e.target.value))}
            style={inputStyle}
          >
            {funcionarios.map(f => (
              <option key={f.id} value={f.id}>
                {f.nome} ({f.cargo})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>De:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Até:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button
          onClick={carregarRelatorio}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? '⏳ Carregando...' : '🔍 Buscar'}
        </button>
      </div>

      {relatorio && (
        <div>
          <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            <h2 style={{ color: 'var(--accent)', marginTop: 0 }}>Resumo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Total de Agendamentos</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                  {relatorio.totalAgendamentos}
                </div>
              </div>
              {Object.entries(relatorio.porStatus || {}).map(([status, count]) => (
                <div key={status}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{status}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: getStatusColor(status) }}>
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {relatorio.porFuncionario?.map(func => (
            <div key={func.funcionarioId} style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--accent)', background: 'var(--bg)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                👤 {func.funcionarioNome} ({func.cargo})
              </h3>

              {func.agendamentos.length === 0 ? (
                <div style={{ background: '#e7f3ff', color: '#004085', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                  ℹ️ Nenhum agendamento neste período.
                </div>
              ) : (
                func.agendamentos.map(agendamento => (
                  <div key={agendamento.id} style={agendamentoStyle(agendamento.status)}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Horário</div>
                      <div style={{ fontWeight: 'bold' }}>
                        {new Date(agendamento.dataHora).toLocaleString('pt-BR')}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        ⏱️ {agendamento.duracao} minutos
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Cliente / Pet</div>
                      <div style={{ fontWeight: 'bold' }}>
                        {agendamento.itemVenda?.cliente?.nome || 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        🐾 {agendamento.itemVenda?.cliente?.pet?.nome} ({agendamento.itemVenda?.cliente?.pet?.especie})
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Serviço</div>
                      <div style={{ fontWeight: 'bold' }}>
                        {agendamento.itemVenda?.tipo || 'N/A'}
                      </div>
                    </div>

                    <div style={buttonGroupStyle}>
                      <div style={statusBadgeStyle(agendamento.status)}>
                        {agendamento.status}
                      </div>

                      {agendamento.status === 'PENDENTE' && (
                        <button
                          onClick={() => mudarStatus(agendamento.id, 'CONFIRMADO')}
                          style={smallButtonStyle('#17a2b8')}
                        >
                          ✓ Confirmar
                        </button>
                      )}

                      {agendamento.status === 'CONFIRMADO' && (
                        <button
                          onClick={() => mudarStatus(agendamento.id, 'REALIZADO')}
                          style={smallButtonStyle('#28a745')}
                        >
                          ✓ Realizado
                        </button>
                      )}

                      {agendamento.status !== 'CANCELADO' && agendamento.status !== 'REALIZADO' && (
                        <button
                          onClick={() => mudarStatus(agendamento.id, 'CANCELADO')}
                          style={smallButtonStyle('#dc3545')}
                        >
                          ✕ Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
