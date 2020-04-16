import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AllTransactionService from '../services/AllTransactionService';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import multerConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(multerConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const allTransactionService = new AllTransactionService();
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await allTransactionService.execute();
  const balance = transactionsRepository.getBalence(transactions);

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTrasactionService = new CreateTransactionService();
  const transaction = await createTrasactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute(id);

  return response.send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // TODO
    const { filename } = request.file;
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute({ filename });

    return response.json(transactions);
  },
);

export default transactionsRouter;
