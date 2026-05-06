import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { Product } from '@blinkit/types';

const MOCK_PRODUCTS: Product[] = [
  { id: 'p001', name: 'Tea Powder',  price: 120, image_url: '/products/tea-powder.webp' },
  { id: 'p002', name: 'Sugar',       price: 45,  image_url: '/products/sugar.webp' },
  { id: 'p003', name: 'Milk',        price: 60,  image_url: '/products/milk.webp' },
];

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const mockService: Partial<ProductsService> = {
      findAll: jest.fn().mockResolvedValue(MOCK_PRODUCTS),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should return 200 with product array', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return products with all required fields (id, name, price, image_url)', async () => {
    const result = await controller.findAll();
    for (const product of result) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('image_url');
      expect(typeof product.id).toBe('string');
      expect(typeof product.name).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
    }
  });

  it('should return exactly the mock product count', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(MOCK_PRODUCTS.length);
  });
});
