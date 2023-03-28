import { Router as router } from 'express';
import { ProductController } from '../controllers/product/product.controller.js';
import { Interceptors } from '../middlewares/interceptor.js';
import { ProductMongoRepo } from '../repositories/product.repo/product.mongo.repo.js';

// Lo sigo luego

export const productsRouter = router();
const repo = ProductMongoRepo.getInstance();
const controller = new ProductController(repo);

productsRouter.get('/', controller.getAll.bind(controller));
productsRouter.get('/:id', controller.getById.bind(controller));
productsRouter.post(
  '/add',
  Interceptors.logged,
  controller.add.bind(controller)
);
productsRouter.patch(
  '/:id',
  Interceptors.logged,
  // Authorized,
  controller.edit.bind(controller)
);

productsRouter.delete(
  '/delete/:id',
  Interceptors.logged,
  // Authorized
  controller.delete.bind(controller)
);
