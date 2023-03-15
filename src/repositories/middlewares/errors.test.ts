import { NextFunction, Request, Response } from 'express';
import { errorsMiddleware } from './errors';
import { Error as MongooseError } from 'mongoose';
import { HTTPError } from '../../errors/error';


describe('Given errorsMiddleware ', () => {
  const req = {} as unknown as Request;

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  describe('When error is a mongoose castError ', () => {
    test('Then status should throw a 400 error ', () => {
      // Arrange
      const error = new MongooseError.CastError('', '', '');
      // Act -> Lo que quiero probar
      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenCalledWith(400);
    });
  });
  describe('When error is a mongoose validation Error ', () => {
    test('Then it should throw a 406 error ', () => {
      // Arrange
      const error = new MongooseError.ValidationError();
      // Act -> Lo que quiero probar
      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenLastCalledWith(406);
    });
  });
  describe('When error is a custom HTTP Error ', () => {
    test('Then it should throw a 418 error ', () => {
      const error = new HTTPError(418, 'Im a teapot', 'Im a teapot');
      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenLastCalledWith(418);
    });
  });

  describe('When error is any other error ', () => {
    test('Then it should throw a 500 error ', () => {
      const error = new Error();

      errorsMiddleware(error, req, resp, next);
      expect(resp.status).toHaveBeenLastCalledWith(500);
    });
  });
});
