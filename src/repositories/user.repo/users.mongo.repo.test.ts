import { User } from '../../entities/user';
import { UserModel } from './users.mongo.model';
import { UserMongoRepo } from './users.mongo.repo';

jest.mock('./users.mongo.model');

describe('Given UserMongoRepo', () => {
  const repo = UserMongoRepo.getInstance();
  const exec = jest.fn();
  beforeEach(() => {
    exec.mockResolvedValue([]);
    UserModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec,
      }),
    });
  });

  describe('When it is intanced', () => {
    test('Then it should be able to be instanced.', () => {
      expect(repo).toBeInstanceOf(UserMongoRepo);
    });
  });

  describe('When we use the query() method', () => {
    test('Then it should return a user array.', async () => {
      const result = await repo.query();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When we use the queryId() method', () => {
    test('Then it should return an empty object.', async () => {
      const id = '1';
      const result = await repo.queryId(id);
      expect(result).toEqual({});
    });
  });

  // Fix this test later
  // describe('When we call the search() method', () => {
  //   test('Then it should return a user array.', async () => {
  //     const query = { key: 'name', value: 'example' };
  //     const result = await repo.search(query);
  //     expect(result).toEqual([]);
  //   });
  // });

  describe('When we call the create() method with an empty object', () => {
    test('Then it should return an empty object.', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({});
      const result = await repo.create({});
      expect(result).toEqual({});
    });
  });

  describe('When we call the update() method...', () => {
    test('Then When we call findByIdAndUpdate method with an invalid info it should throw an error ', async () => {
      const mockUser = {
        id: '2',
      } as Partial<User>;

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue(null);
      expect(async () => repo.update(mockUser)).rejects.toThrow();
    });

    test('Then when we call findByIdAndUpdate method with valid info it should return a User ', async () => {
      const mockUser = {
        id: '2',
        name: 'test',
        lastName: 'test',
      } as Partial<User>;

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue(mockUser);
      const result = await repo.update(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('When the delete method is used', () => {
    test('Then if it cant find the id, it should throw an error', () => {
      const id = '1';
      (UserModel.findByIdAndDelete as jest.Mock).mockReturnValue(null);
      expect(async () => repo.erase(id)).rejects.toThrow();
    });

    test('Then if it has an object to delete with its ID, the findByIdAndDelete function should be called', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      await repo.erase('1');
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
