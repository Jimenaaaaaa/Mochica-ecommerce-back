import { Response, Request, NextFunction } from 'express';
import { Auth, PayloadToken } from '../../services/auth.js';
import createDebug from 'debug';
import { Repo } from '../../repositories/repo.interface.js';
import { HTTPError } from '../../errors/error.js';
import { User } from '../../entities/user.js';

const debug = createDebug('FP: User Controller');

export class UserController {
  constructor(public repo: Repo<User>) {
    debug('Instantiate');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register');
      req.body.password = await Auth.hash(req.body.password);
      const data = await this.repo.create(req.body);
      if (!data) {
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      }

      resp.status(201);
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login');

      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });

      if (!data.length)
        throw new HTTPError(
          401,
          'Incorrect email or password',
          'Email or password not found'
        );

      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new HTTPError(
          401,
          'Incorrect email or password',
          'Email or password not found'
        );

      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'user',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
        user: data,
      });
    } catch (error) {
      next(error);
    }
  }
}
