import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balence {
  income: number;
  outcome: number;
  total: number;
}
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public getBalence(transactions: Transaction[]): Balence {
    const balence = transactions.reduce(
      (total, current) => {
        return {
          income:
            current.type === 'income'
              ? total.income + current.value
              : total.income,
          outcome:
            current.type === 'outcome'
              ? total.outcome + current.value
              : total.outcome,
          total:
            current.type === 'income'
              ? total.total + current.value
              : total.total - current.value,
        };
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balence;
  }
}

export default TransactionsRepository;
