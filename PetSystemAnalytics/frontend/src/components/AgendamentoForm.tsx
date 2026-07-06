import React, { useState, useEffect } from 'react';

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
}

interface Agendamento {
  id: number;
  dataHora: string;
  duracao: number;
  status: string;
  funcionario: Funcionario;
}

interface AgendamentoFormProps {
  itemVendaId: number;
  onSubmit: (agendamento: any) => Promise<void>;
  onCancel: () => void;
}

export function AgendamentoForm({ itemVendaId, onSubmit, onCancel }: AgendamentoFormProps) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [formData, setFormData] = useState({
    funcionarioId: '',
    dataHora: '',
    duracao: 60,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [disponibilidade, setDisponibilidade] = useState<boolean | null>(null);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      // TODO: Implementar chamada à API
      console.log('Carregando funcionários...');
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  const verificarDisponibilidade = async () => {
    if (!formData.funcionarioId || !formData.dataHora) {
      setError('Selecione funcionário e data/hora.');
      return;
    }

    try {
      // TODO: Implementar chamada à API para verificar disponibilidade
      setDisponibilidade(true);
      setError('');
    } catch (err: any) {
      setDisponibilidade(false);
      setError('Funcionário não disponível neste horário.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duracao' ? parseInt(value) : value,
    }));
    setDisponibilidade(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (disponibilidade !== true) {
      setError('Verifique a disponibilidade antes de agendar.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        funcionarioId: parseInt(formData.funcionarioId),
        dataHora: new Date(formData.dataHora),
        duracao: formData.duracao,
        itemVendaId,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao criar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  const formStyle: React.CSSProperties = {
    background: 'var(--bg)',
    padding: '2rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    marginBottom: '2rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
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
    marginRight: '0.5rem',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ color: 'var(--accent)', marginTop: 0 }}>Agendar Serviço</h2>

      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {disponibilidade === true && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          ✓ Funcionário disponível para este horário!
        </div>
      )}

      <select
        name="funcionarioId"
        value={formData.funcionarioId}
        onChange={handleChange}
        style={inputStyle}
        required
      >
        <option value="">Selecione um funcionário</option>
        {funcionarios.map(f => (
          <option key={f.id} value={f.id}>
            {f.nome} ({f.cargo})
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        name="dataHora"
        value={formData.dataHora}
        onChange={handleChange}
        style={inputStyle}
        required
      />

      <select
        name="duracao"
        value={formData.duracao}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="30">30 minutos</option>
        <option value="60">1 hora</option>
        <option value="90">1 hora e 30 minutos</option>
        <option value="120">2 horas</option>
        <option value="180">3 horas</option>
      </select>

      <div style={{ marginBottom: '1rem' }}>
        <button 
          type="button"
          onClick={verificarDisponibilidade}
          style={{ ...buttonStyle, background: '#6c757d' }}
        >
          Verificar Disponibilidade
        </button>
      </div>

      <button 
        type="submit" 
        style={buttonStyle}
        disabled={loading || disponibilidade !== true}
      >
        {loading ? 'Agendando...' : 'Agendar'}
      </button>

      <button 
        type="button"
        onClick={onCancel}
        style={{ ...buttonStyle, background: '#dc3545' }}
      >
        Cancelar
      </button>
    </form>
  );
}
