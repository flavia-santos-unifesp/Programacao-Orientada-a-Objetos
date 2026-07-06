import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setLoading(true);
      // TODO: Implementar chamada à API
      console.log('Carregando funcionários...');
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        // TODO: Implementar chamada à API de delete
        setFuncionarios(funcionarios.filter(f => f.id !== id));
      } catch (error) {
        console.error('Erro ao deletar funcionário:', error);
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
