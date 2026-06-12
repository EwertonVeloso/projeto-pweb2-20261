
export default function App() {
  const simularLogin = () => {
    // Grava um token falso
    localStorage.setItem('financas_token', 'token_falso_123');
    // Dispara o evento para o Host App ouvir
    window.dispatchEvent(new Event('auth_changed'));
    alert('Login simulado! Token gravado e evento disparado.');
  };

  return (
    <div style={{ border: '2px solid red', padding: '2rem', borderRadius: '8px' }}>
      <h2>Módulo de Autenticação (Porta 3001)</h2>
      <button onClick={simularLogin} style={{ padding: '10px' }}>
        Fazer Login (Simulação)
      </button>
    </div>
  );
}