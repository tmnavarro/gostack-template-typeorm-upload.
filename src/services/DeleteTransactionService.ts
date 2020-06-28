import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepositories from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(
      TransactionsRepositories,
    );

    const repository = await transactionsRepository.findOne(id);

    if (!repository) {
      throw new AppError('Repository not found');
    }

    await transactionsRepository.remove(repository);

    return;
  }
}

export default DeleteTransactionService;
