import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';

// Cuando no hay casting
import { Error } from 'mongoose';
import { CustomError, HTTPError } from '../errors/error';

// Paso aqui el que va a gestionarme los errores para que app quede limpia

const debug = createDebug('FP:app:errors');

export const errorsMiddleware = (
  error: CustomError | Error,
  _req: Request,
  resp: Response,
  _next: NextFunction
) => {
  let status = 500;
  let statusMessage = 'Internal server error';

  if (error instanceof HTTPError) {
    status = error.statusCode;
    statusMessage = error.statusMessage;
  }

  if (error instanceof Error.CastError) {
    status = 400;
    statusMessage = 'Bad formatted data in request';
  }

  if (error instanceof Error.ValidationError) {
    status = 406;
    statusMessage = 'Validation error in request.';
  }

  resp.status(status);
  debug('error');
  debug(error.message);
  resp.json({
    error: [
      {
        status,
        statusMessage,
      },
    ],
  });
};
