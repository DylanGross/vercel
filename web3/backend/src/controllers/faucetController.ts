import { Request, Response } from 'express';
import { claimTokensService, getFaucetStatusService } from '../services/faucetService';

export const claimTokens = async (req: Request, res: Response) => {
  try {
    const address = (req as Request & { user: { address: string } }).user.address;
    const result = await claimTokensService(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al reclamar tokens' });
  }
};

export const getFaucetStatus = async (req: Request, res: Response) => {
  try {
    const address = req.params.address;
    const result = await getFaucetStatusService(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estado del faucet' });
  }
};
