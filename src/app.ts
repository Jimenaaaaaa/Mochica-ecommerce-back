/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import morgan from 'morgan';
import { productsRouter } from './routers/products.router.js';
import { usersRouter } from './routers/users.router.js';

// Luego meto los imports de los routers
// import { artistsRouter } from './routers/artists.router';
// import { productsRouter } from './routers/products.router';

const debug = createDebug('FP:app');

export const app = express();

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: '*',
};

app.use('/users', usersRouter);
app.use('/products', productsRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Mochica shop',
    endpoints: {
      users: '/users',
    },
  });
});

// Luego meto el resto de routers:
// app.use('/products', productsRouter);
// app.use('/artists', artistsRouter);

// Voy a gestionar los errores mas tarde
// app.use(errorsMiddleware);
