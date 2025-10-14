// Lógica para SIWE y JWT
import { SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';

export const getMessageService = async (address: string) => {
  // Mensaje SIWE básico
  const message = new SiweMessage({
    domain: 'localhost',
    address,
    statement: 'Sign in with Ethereum to the Faucet dApp',
    uri: 'http://localhost:3000',
    version: '1',
    chainId: 11155111,
  });
  return { message: message.prepareMessage() };
};

export const signInService = async (message: string, signature: string) => {
  const siwe = new SiweMessage(message);
  const result = await siwe.verify({ signature });
  if (!result.success) throw new Error('Firma inválida');
  const token = jwt.sign({ address: siwe.address }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return { token, address: siwe.address };
};
