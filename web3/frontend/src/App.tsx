import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [jwt, setJwt] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [faucetStatus, setFaucetStatus] = useState<any>(null);
  const [claimLoading, setClaimLoading] = useState(false);

  // Conectar MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Por favor instala MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error('Error conectando wallet:', error);
    }
  };

  // Desconectar
  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    setJwt(null);
    setFaucetStatus(null);
  };

  // Autenticación SIWE
  const handleAuth = async () => {
    if (!address) return;
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      // Paso 1: Obtener mensaje SIWE
      const res = await axios.post('http://localhost:3000/auth/message', { address });
      const message = res.data.message;
      
      // Paso 2: Firmar con MetaMask
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });
      
      // Paso 3: Verificar y obtener JWT
      const signinRes = await axios.post('http://localhost:3000/auth/signin', { 
        message, 
        signature 
      });
      setJwt(signinRes.data.token);
      
      // Cargar estado del faucet
      await loadFaucetStatus(signinRes.data.token);
    } catch (err: any) {
      setAuthError(err.response?.data?.error || 'Error de autenticación');
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Cargar estado del faucet
  const loadFaucetStatus = async (token: string) => {
    if (!address) return;
    try {
      const res = await axios.get(`http://localhost:3000/faucet/status/${address}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaucetStatus(res.data);
    } catch (err) {
      console.error('Error cargando estado:', err);
    }
  };

  // Reclamar tokens
  const claimTokens = async () => {
    if (!address || !jwt) return;
    setClaimLoading(true);
    
    try {
      const res = await axios.post(
        'http://localhost:3000/faucet/claim',
        { address },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      alert(`¡Éxito! Txn hash: ${res.data.txHash}`);
      await loadFaucetStatus(jwt);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error reclamando tokens');
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚰 Web3 Faucet dApp</h1>
        <p>Sepolia Testnet</p>
        
        {!isConnected ? (
          <div>
            <button onClick={connectWallet} className="btn-primary">
              Conectar MetaMask
            </button>
          </div>
        ) : (
          <div>
            <div className="address-box">
              <strong>Conectado:</strong> {address?.substring(0, 6)}...{address?.substring(38)}
            </div>
            <button onClick={disconnectWallet} className="btn-secondary">
              Desconectar
            </button>
            
            <hr />
            
            {!jwt ? (
              <div>
                <button onClick={handleAuth} disabled={authLoading} className="btn-primary">
                  {authLoading ? 'Autenticando...' : 'Autenticarse con SIWE'}
                </button>
                {authError && <div className="error">{authError}</div>}
              </div>
            ) : (
              <div>
                <h3>✅ Autenticado</h3>
                
                {faucetStatus && (
                  <div className="status-box">
                    <p><strong>Próximo reclamo disponible:</strong></p>
                    <p>{new Date(faucetStatus.nextClaimTime).toLocaleString()}</p>
                    <p><strong>Puede reclamar:</strong> {faucetStatus.canClaim ? '✅ Sí' : '❌ No'}</p>
                  </div>
                )}
                
                <button 
                  onClick={claimTokens} 
                  disabled={claimLoading || (faucetStatus && !faucetStatus.canClaim)}
                  className="btn-primary"
                >
                  {claimLoading ? 'Reclamando...' : '💧 Reclamar Tokens'}
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
