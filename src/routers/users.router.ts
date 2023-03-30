import { Router as router } from 'express';
import { UserController } from '../controllers/user/user.controller.js';
import { UserMongoRepo } from '../repositories/user.repo/users.mongo.repo.js';

export const usersRouter = router();
const repo = UserMongoRepo.getInstance();
const controller = new UserController(repo);

usersRouter.post('/login', controller.login.bind(controller));
usersRouter.post('/register', controller.register.bind(controller));
