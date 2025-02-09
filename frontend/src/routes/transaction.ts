import express from 'express';
import { z } from 'zod';
import asyncHandler from 'express-async-handler';
import { authenticate } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';

export const transactionRouter = express.Router();

transactionRouter.use(authenticate);

const amountSchema = z.object({
  amount: z.number().positive()
});

const transferSchema = z.object({
  amount: z.number().positive(),
  destinationAccount: z.string()
});

transactionRouter.post('/deposit', asyncHandler(async (req, res) => {
  const { amount } = amountSchema.parse(req.body);

  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', req.user.id)
    .single();

  if (accountError) {
    throw new Error('Conta não encontrada');
  }

  const { data, error } = await supabase
    .rpc('process_deposit', {
      p_account_id: account.id,
      p_amount: amount
    });

  if (error) {
    throw new Error('Erro ao processar depósito');
  }

  res.json({ message: 'Depósito realizado com sucesso' });
}));

transactionRouter.post('/withdraw', asyncHandler(async (req, res) => {
  const { amount } = amountSchema.parse(req.body);

  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', req.user.id)
    .single();

  if (accountError) {
    throw new Error('Conta não encontrada');
  }

  const { data, error } = await supabase
    .rpc('process_withdrawal', {
      p_account_id: account.id,
      p_amount: amount
    });

  if (error) {
    throw new Error('Erro ao processar saque');
  }

  res.json({ message: 'Saque realizado com sucesso' });
}));

transactionRouter.post('/transfer', asyncHandler(async (req, res) => {
  const { amount, destinationAccount } = transferSchema.parse(req.body);

  const { data: sourceAccount, error: sourceError } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', req.user.id)
    .single();

  if (sourceError) {
    throw new Error('Conta não encontrada');
  }

  const { data: destAccount, error: destError } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', destinationAccount)
    .single();

  if (destError || !destAccount) {
    throw new Error('Conta de destino não encontrada');
  }

  const { data, error } = await supabase
    .rpc('process_transfer', {
      p_from_account_id: sourceAccount.id,
      p_to_account_id: destAccount.id,
      p_amount: amount
    });

  if (error) {
    throw new Error('Erro ao processar transferência');
  }

  res.json({ message: 'Transferência realizada com sucesso' });
}));

transactionRouter.get('/history', asyncHandler(async (req, res) => {
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', req.user.id)
    .single();

  if (accountError) {
    throw new Error('Conta não encontrada');
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      id,
      type,
      amount,
      description,
      created_at,
      destination_account_id
    `)
    .eq('account_id', account.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Erro ao buscar histórico');
  }

  res.json(transactions);
}));