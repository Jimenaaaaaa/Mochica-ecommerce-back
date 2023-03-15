import { Response, Request, NextFunction } from 'express';
import { User } from '../entities/user.js';
import { Auth, PayloadToken } from '../services/auth.js';
import { Repo } from '../repositories/repo.interface.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/error.js';

const debug = createDebug('FP: User Controller');

export class UserController {
  constructor(public repo: Repo<User>) {
    debug('Instantiate');
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login');
      // Login recibe un email y un password.
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      console.log(this.repo.search({ key: 'email', value: '111' }));
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

      // Esto lo tengo que cambiar cuando haga el register
      if (req.body.password !== data[0].password)
        throw new HTTPError(
          401,
          'Incorrect email or password',
          'Email or password not found'
        );
      // If (!(await Auth.compare(req.body.password, data[0].password)))
      //   throw new Error();

      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }
}
