import { Router } from 'express';
import { claimTokens, getFaucetStatus } from '../controllers/faucetController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/claim', authenticateJWT, claimTokens);
router.get('/status/:address', authenticateJWT, getFaucetStatus);

export default router;
