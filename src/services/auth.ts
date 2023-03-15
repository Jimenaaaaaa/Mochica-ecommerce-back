import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import createDebug from 'debug';
import { config } from '../config.js';
const debug = createDebug('W6:services:auth');

debug('Loaded');

export interface PayloadToken extends jwt.JwtPayload {
  id: string;
  email: string;
  role: string;
}

const salt = 10;

export class Auth {
  static createJWT(payload: PayloadToken) {
    return jwt.sign(payload, config.jwtSecret as string);
  }

  static verifyJWTGettingPayload(token: string) {
    const result = jwt.verify(token, config.jwtSecret as string);
    if (typeof result === 'string')
      // A;adir despues
      // throw new HTTPError(498, 'Invalid payload', result);
      throw new Error();
    return result as PayloadToken;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
