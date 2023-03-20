/* eslint-disable @typescript-eslint/no-unused-vars */
import { Repo } from '../repo.interface.js';
import createDebug from 'debug';
import { HTTPError } from '../../errors/error.js';
import { Product } from '../../entities/product.js';
import { ProductModel } from './product.mongo.model.js';
const debug = createDebug('FP:repo:Products');

export class ProductMongoRepo implements Repo<Product> {
  private static instance: ProductMongoRepo;

  public static getInstance(): ProductMongoRepo {
    if (!ProductMongoRepo.instance) {
      ProductMongoRepo.instance = new ProductMongoRepo();
    }

    return ProductMongoRepo.instance;
  }

  private constructor() {
    debug('instantiate');
  }

  async query(): Promise<Product[]> {
    const data: Product[] = await ProductModel.find()
      .populate('products', {
        author: {},
      })
      .exec();
    return data;
  }

  async queryId(id: string): Promise<Product> {
    debug('queryId: ' + id);
    const data = await ProductModel.findById(id)
      // Problems in posman
      .populate('products', { author: {} })
      .exec();
    if (!data) throw new HTTPError(404, 'Id not found', 'Id not found');
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<Product[]> {
    debug('search');
    const data: Product[] = await ProductModel.find({
      [query.key]: query.value,
    })

      // Esto me da problemas
      .populate('owner')
      .exec();
    return data;
  }

  async create(Product: Partial<Product>): Promise<Product> {
    debug('create');
    const data = await ProductModel.create(Product);
    debug('data from create =', data);
    return data;
  }

  async update(info: Partial<Product>): Promise<Product> {
    debug('update');
    const data = await ProductModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    return data as Product;
  }

  async erase(id: string): Promise<void> {
    debug('erase');
    const data = ProductModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(404, 'Not found', 'Delete not posible: id not found');
  }
}
