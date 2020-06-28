import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transationRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transationRepository.getBalance();

    if (type === 'outcome') {
      if (total < value) {
        throw new AppError('Outcome value lg Balance Total');
      }
    }

    let transactionCategory = await categoryRepository.findOne({
      where: { type: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(transactionCategory);
    }

    const transaction = transationRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transationRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
