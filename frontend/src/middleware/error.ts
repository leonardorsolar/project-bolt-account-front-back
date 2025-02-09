import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err.message === 'Insufficient funds') {
    return res.status(400).json({
      error: 'Saldo insuficiente para realizar a operação'
    });
  }

  res.status(500).json({
    error: 'Erro interno do servidor'
  });
};