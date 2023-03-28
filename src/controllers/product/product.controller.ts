import { Response, Request, NextFunction } from 'express';
import createDebug from 'debug';
import { Product } from '../../entities/product.js';
import { HTTPError } from '../../errors/error.js';
import { Repo } from '../../repositories/repo.interface.js';

const debug = createDebug('FP: Product Controller');

export class ProductController {
  constructor(public ProductsRepo: Repo<Product>) {
    debug('Instantiate');
  }

  async add(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('add-method');

      const newProduct = req.body;
      debug('new Product: ', newProduct);

      const data = await this.ProductsRepo.create(newProduct);
      debug(data);
      resp.status(201);
      resp.json({
        results: [data],
      });
      debug(data);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');

      const filter = req.query.filter || 'all';

      if (
        filter !== 'mug' &&
        filter !== 'vase' &&
        filter !== 'glass' &&
        filter !== 'plate' &&
        filter !== 'bowl' &&
        filter !== 'jewerly' &&
        filter !== 'other' &&
        filter !== 'all'
      ) {
        throw new HTTPError(400, 'Wrong region', 'Non existing region');
      }

      let data;
      if (filter === 'all') {
        data = await this.ProductsRepo.query();
      } else {
        data = await this.ProductsRepo.search({ key: 'type', value: filter });
      }

      const dataLength = data.length / 12;
      const page = Number(req.query.page || '1');

      if (page < 1) {
        throw new HTTPError(400, 'Wrong page', 'Page doesnt exist');
      }

      const slicedData = data.slice((page - 1) * 12, page * 12);
      resp.json({
        results: {
          slicedData,
          length: dataLength,
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getId-method');
      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Not found guitar ID in params');

      const result = await this.ProductsRepo.queryId(req.params.id);
      resp.status(201);
      resp.json({
        results: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async edit(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('edit-method');
      if (!req.params.id) throw new HTTPError(404, 'Not found', 'Id ');
      req.body.id = req.params.id;
      const data = await this.ProductsRepo.update(req.body);
      resp.status(201);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete-method');

      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Not found guitar ID in params');

      await this.ProductsRepo.erase(req.params.id);

      resp.status(201);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
