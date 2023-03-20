import { Response, Request } from 'express';
import { Product } from '../../entities/product';
import { RequestPlus } from '../../middlewares/interceptor';
import { ProductMongoRepo } from '../../repositories/product.repo/product.mongo.repo';
import { ProductController } from './product.controller';

describe('Given the ProductsController', () => {
  const mockProductsRepo: ProductMongoRepo = {
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
  };

  const req = {
    body: {},
    params: { id: '' },
  } as unknown as Request;
  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new ProductController(mockProductsRepo);

  describe('When the getAll method is called', () => {
    test('And all the data is OK', async () => {
      const req = {} as unknown as Request;
      await controller.getAll(req, resp, next);
      expect(mockProductsRepo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('And if there is an error, next function will be called', async () => {
      (mockProductsRepo.query as jest.Mock).mockRejectedValue(new Error());
      await controller.getAll(req, resp, next);
      expect(mockProductsRepo.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we use the getById method', () => {
    test('Then if it should be no errors', async () => {
      const req = {
        body: {},
        params: { id: '1' },
      } as unknown as Request;

      await controller.getById(req, resp, next);
      expect(mockProductsRepo.queryId).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are errors', async () => {
      (mockProductsRepo.queryId as jest.Mock).mockRejectedValue(new Error(''));
      await controller.getById(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we use the Add method', () => {
    test('Then it should create a new Products and return it', async () => {
      const mockProducts = {
        name: 'Mock Product',
      } as unknown as Product;
      const mockReq = {
        body: mockProducts,
      } as unknown as RequestPlus;

      await controller.add(mockReq, resp, next);
      expect(mockProductsRepo.create).toHaveBeenCalledWith(mockProducts);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are errors', async () => {
      (mockProductsRepo.create as jest.Mock).mockRejectedValue(new Error(''));
      await controller.add(req, resp, next);
      expect(mockProductsRepo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When we use the patch method', () => {
    test('Then if all the data is correct, there should be no errors', async () => {
      const req = {
        body: {
          id: '1',
        },
        params: {
          id: '1',
        },
      } as unknown as Request;

      await controller.edit(req, resp, next);
      expect(mockProductsRepo.update).toHaveBeenCalledWith(req.body);
      expect(req.params.id).toBe('1');
    });
    test('Then if there are errors', async () => {
      (mockProductsRepo.update as jest.Mock).mockRejectedValue(new Error(''));
      await controller.edit(req, resp, next);
      expect(mockProductsRepo.update).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    describe('When we use the delete method', () => {
      test('Then if it should be no errors', async () => {
        const req = {
          body: {},
          params: { id: '1' },
        } as unknown as Request;
        await controller.delete(req, resp, next);
        expect(mockProductsRepo.erase).toHaveBeenCalled();
        expect(resp.json).toHaveBeenCalled();
      });

      test('Then if there are errors', async () => {
        (mockProductsRepo.erase as jest.Mock).mockRejectedValue(new Error(''));
        await controller.delete(req, resp, next);
        expect(mockProductsRepo.erase).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
