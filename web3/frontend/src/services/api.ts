// Servicio para llamadas al backend
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getFaucetStatus = async (address: string) => {
  return axios.get(`${API_URL}/faucet/status/${address}`);
};

export const claimTokens = async (token: string) => {
  return axios.post(`${API_URL}/faucet/claim`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const signInWithEthereum = async (message: string, signature: string) => {
  return axios.post(`${API_URL}/auth/signin`, { message, signature });
};
