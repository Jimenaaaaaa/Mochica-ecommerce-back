import { Response, Request } from 'express';
import { Product } from '../../entities/product.js';
import { HTTPError } from '../../errors/error.js';
import { RequestPlus } from '../../middlewares/interceptor.js';
import { ProductMongoRepo } from '../../repositories/product.repo/product.mongo.repo.js';
import { ProductController } from './product.controller.js';

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
    test('And all the data is OK, then query should have been called', async () => {
      const req = {
        body: {},
        params: { id: '' },
        query: {
          filter: 'all',
          page: 1,
        },
      } as unknown as Request;
      await controller.getAll(req, resp, next);
      expect(mockProductsRepo.query).toHaveBeenCalled();
    });

    test('if filter is something else than the required filters', async () => {
      const req = {
        body: {},
        params: { id: '' },
        query: {
          filter: 'pot',
          page: 1,
        },
      } as unknown as Request;
      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalledWith(
        new HTTPError(400, 'Wrong region', 'Non existing region')
      );
    });

    test('if page is less than 1', async () => {
      const req = {
        body: {},
        params: { id: '' },
        query: {
          filter: 'all',
          page: '0',
        },
      } as unknown as Request;

      (mockProductsRepo.query as jest.Mock).mockResolvedValue([{}]);

      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalledWith(
        new HTTPError(400, 'Wrong page', 'Page doesnt exist')
      );
    });

    test('Then if filter is not "all", search method should have been called ', async () => {
      const req = {
        body: {},
        params: { id: '' },
        query: {
          filter: 'mug',
          page: 1,
        },
      } as unknown as Request;

      (mockProductsRepo.search as jest.Mock).mockResolvedValue([]);

      await controller.getAll(req, resp, next);
      expect(mockProductsRepo.search).toHaveBeenCalled();
    });

    test('Then if we dont pass a filter, "all" should be set as default filter ', async () => {
      const req = {
        body: {},
        params: { id: '' },
        query: {
          page: 1,
        },
      } as unknown as Request;

      (mockProductsRepo.query as jest.Mock).mockResolvedValue([]);

      await controller.getAll(req, resp, next);
      expect(mockProductsRepo.query).toHaveBeenCalled();
    });

    test('Then if we dont pass a page, "1" should be set as default page ', async () => {
      const req = {
        body: {},
        params: { id: '' },
        query: {
          filter: 'all',
        },
      } as unknown as Request;

      (mockProductsRepo.query as jest.Mock).mockResolvedValue([]);

      await controller.getAll(req, resp, next);
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
