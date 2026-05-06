import { Injectable } from '@nestjs/common';
import { Order } from '@blinkit/types';
import { OrdersRepository } from '../orders/orders.repository';

@Injectable()
export class RecommendationsRepository {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getAllOrders(): Promise<Order[]> {
    return this.ordersRepository.findAll();
  }

  async getOrdersContaining(itemName: string): Promise<Order[]> {
    return this.ordersRepository.findByItem(itemName);
  }
}
