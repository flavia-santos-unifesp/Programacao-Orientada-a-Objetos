import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';

interface Funcionario {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  cargo: string;
}

export function FuncionarioList() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAPI<Funcionario[]>('/funcionarios');
      setFuncionarios(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar funcionários');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await fetchAPI(`/funcionarios/${id}`, { method: 'DELETE' });
        setFuncionarios(funcionarios.filter(f => f.id !== id));
      } catch (err: any) {
        setError(err.message || 'Erro ao deletar funcionário');
        console.error('Erro:', err);
      }
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const infoStyle: React.CSSProperties = {
    flex: 1,
  };

  const buttonStyle: React.CSSProperties = {
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '0.5rem',
  };

  if (loading) {
    return <div style={{ color: 'var(--text)' }}>Carregando funcionários...</div>;
  }

  if (error) {
    return (
      <div style={{ color: '#dc3545', padding: '1rem', background: '#f8d7da', borderRadius: '4px' }}>
        ❌ {error}
      </div>
    );
  }

  return (
    <div>
      {funcionarios.length === 0 ? (
        <div style={{ color: 'var(--text)' }}>Nenhum funcionário cadastrado.</div>
      ) : (
        funcionarios.map(funcionario => (
          <div key={funcionario.id} style={cardStyle}>
            <div style={infoStyle}>
              <h3 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
                {funcionario.nome}
              </h3>
              <p style={{ color: 'var(--text)', margin: '0.25rem 0' }}>
                <strong>Cargo:</strong> {funcionario.cargo}
              </p>
              <p style={{ color: 'var(--text)', margin: '0.25rem 0' }}>
                <strong>Email:</strong> {funcionario.email}
              </p>
              <p style={{ color: 'var(--text)', margin: '0.25rem 0' }}>
                <strong>Telefone:</strong> {funcionario.telefone}
              </p>
            </div>
            <div>
              <button style={buttonStyle}>Editar</button>
              <button 
                style={{ ...buttonStyle, background: '#dc3545' }}
                onClick={() => handleDelete(funcionario.id)}
              >
                Deletar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
