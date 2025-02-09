import express from 'express';
import asyncHandler from 'express-async-handler';
import { authenticate } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';

export const accountRouter = express.Router();

accountRouter.use(authenticate);

accountRouter.get('/balance', asyncHandler(async (req, res) => {
  const { data: account, error } = await supabase
    .from('accounts')
    .select('balance')
    .eq('user_id', req.user.id)
    .single();

  if (error) {
    throw new Error('Erro ao buscar saldo');
  }

  res.json({ balance: account.balance });
}));

accountRouter.get('/details', asyncHandler(async (req, res) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('name, account_number, agency')
    .eq('id', req.user.id)
    .single();

  if (error) {
    throw new Error('Erro ao buscar detalhes da conta');
  }

  res.json(profile);
}));