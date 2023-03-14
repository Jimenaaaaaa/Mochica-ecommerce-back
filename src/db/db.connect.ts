import mongoose from 'mongoose';
import { config } from '../config.js';
const { cluster, user, password, dbName } = config;

import createDebug from 'debug';
const debug = createDebug('FP:dbConnect');


export const dbConnect = (env?: string) => {
  debug('enter function');
  const finalEnv = env || process.env.NODE_ENV;
  const finalDBName = finalEnv === 'test' ? dbName + '_testing' : dbName;

  const uri = `mongodb+srv://${user}:${password}@${cluster}/${finalDBName}?retryWrites=true&w=majority`;
  console.log(uri);
  return mongoose.connect(uri);
};
