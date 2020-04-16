import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findByTitle({ title }: Request): Promise<Category | undefined> {
    const category = await this.findOne({ title });

    return category;
  }
}

export default CategoriesRepository;
