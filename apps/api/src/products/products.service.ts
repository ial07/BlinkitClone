import { Injectable } from '@nestjs/common';
import { Product } from '@blinkit/types';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }
}
