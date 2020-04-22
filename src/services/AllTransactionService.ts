import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Balence {
  income: number;
  outcome: number;
  total: number;
}

class AllTransactionService {
  public async execute(): Promise<{
    transactions: Transaction[];
    balance: Balence;
  }> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRepository.find();
    const balance = transactionsRepository.getBalence(transactions);

    return { transactions, balance };
  }
}

export default AllTransactionService;
