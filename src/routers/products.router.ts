import { Router as router } from 'express';
import { ProductController } from '../controllers/product/product.controller.js';
import { Interceptors } from '../middlewares/interceptor.js';
import { ProductMongoRepo } from '../repositories/product.repo/product.mongo.repo.js';

// Lo sigo luego

export const productsRouter = router();
const repo = ProductMongoRepo.getInstance();
const controller = new ProductController(repo);

productsRouter.get('/', controller.getAll.bind(controller));
productsRouter.get('/:id', controller.getId.bind(controller));
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

// // productsRouter.delete(
// //   '/delete',
// //   Interceptors.logged,
// //   Interceptors.authorized,
// //   controller.delete.bind(controller)
// // );

// // El filtro es un get,asi que puedo filtrarlo en el front.
// productsRouter.get('/:filter/:type', controller.getByFilter.bind(controller)); // Este puede que lo quite
