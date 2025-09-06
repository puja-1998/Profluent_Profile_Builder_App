import express from 'express';
import { requireAuth } from '../middleware/auth.js'
import { getUserCreditBalance, getUserCreditHistory } from '../controller/creditsController.js';

const creditRoutes = express.Router();

creditRoutes.get("/balance", requireAuth, getUserCreditBalance);
creditRoutes.get("/ledger", requireAuth, getUserCreditHistory);

export default creditRoutes;