import { Request, Response } from 'express';
import { getMessageService, signInService } from '../services/authService';

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    const result = await getMessageService(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al generar mensaje de autenticación' });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { message, signature } = req.body;
    const result = await signInService(message, signature);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: 'Error de autenticación' });
  }
};
