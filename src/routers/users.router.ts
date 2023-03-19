import { Router as router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { UserMongoRepo } from '../repositories/user.repo/users.mongo.repo.js';

export const usersRouter = router();
const repo = UserMongoRepo.getInstance();
const controller = new UserController(repo);

// Para hacerlo despues del login
// usersRouter.get('/', controller.getAll.bind(controller));
// usersRouter.patch('/', Interceptors.logged, controller.edit.bind(controller));
// usersRouter.patch(
//   '/cart',
//   Interceptors.logged,
//   Interceptors.authorized,
//   controller.editCart.bind(controller)
// );
usersRouter.post('/login', controller.login.bind(controller));
// Para hacerlo despues del login
usersRouter.post('/register', controller.register.bind(controller));
