import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import TransactionRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import AppError from '../errors/AppError';

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
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    if (type.trim() === 'outcome') {
      const transactions = await transactionRepository.find();
      const balence = transactionRepository.getBalence(transactions);

      if (balence.total - value < 0) {
        throw new AppError('Do not have enough money');
      }
    }

    const searchCategory = await categoryRepository.findByTitle({
      title: category.trim(),
    });

    if (!searchCategory) {
      const newCategory = categoryRepository.create({ title: category.trim() });
      const createdCategory = await categoryRepository.save(newCategory);

      const transaction = transactionRepository.create({
        title,
        value,
        type: type.trim(),
        category_id: createdCategory.id,
      });

      await transactionRepository.save(transaction);
      return transaction;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type: type.trim(),
      category_id: searchCategory.id,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
