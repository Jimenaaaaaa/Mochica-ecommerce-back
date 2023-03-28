import { Product } from '../../entities/product';
import { ProductModel } from './product.mongo.model';
import { ProductMongoRepo } from './product.mongo.repo';

jest.mock('./product.mongo.model');

describe('Given ProductMongoRepo', () => {
  const repo = ProductMongoRepo.getInstance();

  describe('When it is intanced', () => {
    test('Then it should be able to be instanced.', () => {
      expect(repo).toBeInstanceOf(ProductMongoRepo);
    });
  });

  describe('When we use the query() method', () => {
    test('Then it should return a Product array.', async () => {
      (ProductModel.find as jest.Mock).mockResolvedValue([
        {
          name: 'test',
        },
      ]);

      const result = await repo.query();
      expect(result).toEqual([
        {
          name: 'test',
        },
      ]);
    });
  });

  describe('When we use the queryId() method', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue({
        name: 'test',
        id: '1',
      });
      const result = await repo.queryId('1');
      expect(ProductModel.findById).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'test',
        id: '1',
      });
    });

    test('Then if the id is not found, it should throw an error', async () => {
      const id = '';
      (ProductModel.findById as jest.Mock).mockReturnValue(null);
      expect(async () => repo.queryId(id)).rejects.toThrow();
    });
  });

  describe('When we call the search() method', () => {
    test('Then it should return a Product array.', async () => {
      (ProductModel.find as jest.Mock).mockResolvedValue([
        {
          name: 'example',
          id: '1',
        },
      ]);
      const query = { key: 'name', value: 'example' };
      const result = await repo.search(query);
      expect(result).toEqual([
        {
          name: 'example',
          id: '1',
        },
      ]);
    });
  });

  describe('When we call the create() method with an empty object', () => {
    test('Then it should return an empty object.', async () => {
      (ProductModel.create as jest.Mock).mockResolvedValue({});
      const result = await repo.create({});
      expect(result).toEqual({});
    });
  });

  describe('When we call the update() method...', () => {
    test('Then When we call findByIdAndUpdate method with an invalid info it should throw an error ', async () => {
      const mockProduct = {
        id: '2',
      } as Partial<Product>;

      ProductModel.findByIdAndUpdate = jest.fn().mockReturnValue(null);
      expect(async () => repo.update(mockProduct)).rejects.toThrow();
    });

    test('Then when we call findByIdAndUpdate method with valid info it should return a Product ', async () => {
      const mockProduct = {
        id: '2',
        name: 'test',
        lastName: 'test',
      } as Partial<Product>;

      ProductModel.findByIdAndUpdate = jest.fn().mockReturnValue(mockProduct);
      const result = await repo.update(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('When the delete method is used', () => {
    test('Then if it cant find the id, it should throw an error', () => {
      const id = '1';
      (ProductModel.findByIdAndDelete as jest.Mock).mockReturnValue(null);
      expect(async () => repo.erase(id)).rejects.toThrow();
    });

    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      (ProductModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      await repo.erase('1');
      expect(ProductModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
