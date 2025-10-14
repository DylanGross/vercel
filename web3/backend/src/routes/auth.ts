import { Router } from 'express';
import { getMessage, signIn } from '../controllers/authController';

const router = Router();

router.post('/message', getMessage);
router.post('/signin', signIn);

export default router;
