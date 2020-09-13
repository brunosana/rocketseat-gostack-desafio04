import { request } from 'express';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (value <= 0) {
      throw Error('must be a valid value');
    }
    if (!title) {
      throw Error('must be a valid title');
    }
    if (type !== 'income' && type !== 'outcome') {
      throw Error('must be a valid type');
    }

    const balance = this.transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw Error('outcome value greather than total balance');
    }

    const transation = new Transaction({ title, type, value });
    this.transactionsRepository.create(transation);
    return transation;
  }
}

export default CreateTransactionService;
