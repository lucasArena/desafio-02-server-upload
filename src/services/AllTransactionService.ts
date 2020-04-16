import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
// import CategoriesRepository from '../repositories/CategoriesRepository';
import Transaction from '../models/Transaction';

class AllTransactionService {
  public async execute(): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRepository.find();

    return transactions;
  }
}

export default AllTransactionService;
