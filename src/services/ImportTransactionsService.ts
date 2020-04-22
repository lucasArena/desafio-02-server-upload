import fs from 'fs';
import path from 'path';
// import csv from 'csv-parse';
import csv from 'neat-csv';
// import Transaction from '../models/Transaction';

import uploadConfig from '../config/upload';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import handleWait from '../utils/handleAwait';

interface Request {
  filename: string;
}

interface RequestTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    // TODO
    const createTransactionService = new CreateTransactionService();
    const filePath = path.resolve(uploadConfig.directory, filename);

    const file = fs.createReadStream(filePath);
    const transactions: RequestTransaction[] = await csv(file);

    const formattedTransactions = JSON.parse(
      JSON.stringify(transactions).replace(/\s(?=\w+":)/g, ''),
    ) as RequestTransaction[];

    const createdTransactions = await Promise.all(
      formattedTransactions.map(async transaction => {
        const createdTransaction = await createTransactionService.execute({
          title: transaction.title,
          type: transaction.type,
          value: Number(transaction.value),
          category: transaction.category,
        });
        return createdTransaction;
      }),
    );

    return createdTransactions;
  }
}

export default ImportTransactionsService;
