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

      // Ver si le meto una gestion de errores en caso de que no se metan todos los campos
      // if (req.body.style !== 'Name' && req.body.style !== 'Artist')
      //   throw new HTTPError(
      //     400,
      //     'Wrong guitar type',
      //     'The guitar type is not Electric neither Acoustic'
      //   );

      const data = await this.ProductsRepo.create(newProduct);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.ProductsRepo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }

    // Veo si añado esto despues
    // const pageString = req.query.page || '1';
    // const pageNumber = Number(pageString);
    // if (pageNumber < 1 || pageNumber > 5)
    //   throw new HTTPError(
    //     400,
    //     'Wrong page number',
    //     'The page number in query params is not correct'
    //   );

    // const style = req.query.style || 'All';

    // if (style !== 'Electric' && style !== 'Acoustic' && style !== 'All')
    //   throw new HTTPError(
    //     400,
    //     'Wrong style type',
    //     'The style in query params is not correct'
    //   );

    // let productsFiltered: Product[];

    // if (style === 'All') {
    //   productsFiltered = await this.ProductsRepo.query();
    // } else {
    //   productsFiltered = await this.ProductsRepo.search({
    //     key: 'style',
    //     value: style,
    //   });
    // }

    // const productsData = productsFiltered.slice(
    //   (pageNumber - 1) * 5,
    //   pageNumber * 5
    // );
  }

  async getId(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getId-method');

      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Not found guitar ID in params');

      const result = await this.ProductsRepo.queryId(req.params.id);

      resp.status(201);
      resp.json({
        results: [result],
      });
    } catch (error) {
      next(error);
    }
  }

  async edit(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('edit-method');

      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Id ');

      req.body.id = req.params.id;

      const data = await this.ProductsRepo.update(req.body);

      resp.status(201);
      resp.json({
        results: [data],
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
