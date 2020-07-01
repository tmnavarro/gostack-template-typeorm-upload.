import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import muter from 'multer';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = muter(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionReponsitory = getCustomRepository(TransactionsRepository);

  const transactions = await transactionReponsitory.find({
    relations: ['category'],
  });
  const balance = await transactionReponsitory.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transation = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transation);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransations = new ImportTransactionsService();

    const transactions = await importTransations.execute(request.file.path);

    return response.json(transactions);
  },
);

export default transactionsRouter;
