import fs from 'fs';
import path from 'path';
// import csv from 'csv-parse';
import csv from 'neat-csv';
// import Transaction from '../models/Transaction';

import uploadConfig from '../config/upload';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

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
    );

    const newTrasactions: Transaction[] = [];
    for (const transaction of formattedTransactions) {
      const newTrasaction = await createTransactionService.execute({
        title: transaction.title,
        type: transaction.type,
        value: Number(transaction.value),
        category: transaction.category,
      });
      newTrasactions.push(newTrasaction);
    }

    // const newTrasactions = await Promise.all(
    //   transactions.map(async transaction => {
    //     console.log('COMEÇOU');
    //     const newTrasaction = await createTransactionService.execute({
    //       title: transaction.title,
    //       type: transaction.type,
    //       value: Number(transaction.value),
    //       category: transaction.category,
    //     });

    //     console.log(newTrasaction);
    //     console.log('FINALIZOU');
    //     return newTrasaction;
    //   }),
    // );

    return newTrasactions;
  }
}

export default ImportTransactionsService;
