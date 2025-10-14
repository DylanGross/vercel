import React, { useEffect, useState } from 'react';
import { getFaucetStatus, claimTokens } from '../services/api';

interface Props {
  address: string;
  token: string;
}

const FaucetStatus: React.FC<Props> = ({ address, token }) => {
  const [status, setStatus] = useState<{ hasClaimed: boolean; balance: string; users: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    getFaucetStatus(address)
      .then(res => setStatus(res.data))
      .catch(() => setError('Error al consultar estado'))
      .finally(() => setLoading(false));
  }, [address]);

  const handleClaim = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await claimTokens(token);
      setTxHash(res.data.txHash);
      setStatus(s => s ? { ...s, hasClaimed: true } : s);
    } catch {
      setError('Error al reclamar tokens');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!status) return null;

  return (
    <div>
      <div>Balance: {status.balance}</div>
      <div>¿Ya reclamaste?: {status.hasClaimed ? 'Sí' : 'No'}</div>
      <button onClick={handleClaim} disabled={status.hasClaimed || loading}>
        Reclamar tokens
      </button>
      {txHash && <div>Transacción: {txHash}</div>}
      <div>Usuarios que reclamaron:</div>
      <ul>
        {status.users.map(u => <li key={u}>{u}</li>)}
      </ul>
    </div>
  );
};

export default FaucetStatus;
