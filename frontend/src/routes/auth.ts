import express from 'express';
import { z } from 'zod';
import asyncHandler from 'express-async-handler';
import { supabase } from '../lib/supabase.js';
import { generateAccountNumber } from '../utils/account.js';

export const authRouter = express.Router();

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

authRouter.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError || !authData.user) {
    throw new Error('Erro ao criar usuário');
  }

  const accountNumber = generateAccountNumber();

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      name,
      account_number: accountNumber
    });

  if (profileError) {
    throw new Error('Erro ao criar perfil');
  }

  const { error: accountError } = await supabase
    .from('accounts')
    .insert({
      user_id: authData.user.id
    });

  if (accountError) {
    throw new Error('Erro ao criar conta');
  }

  res.status(201).json({
    message: 'Usuário registrado com sucesso'
  });
}));

authRouter.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    return res.status(401).json({
      error: 'Credenciais inválidas'
    });
  }

  res.json({
    user: data.user,
    session: data.session
  });
}));