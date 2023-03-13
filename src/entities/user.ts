import { Product } from './product';

export type RegisteredUser = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

export type LogginData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  cart: Product[];
  city?: string;
  street?: string;
  PC?: number;
  IBAN?: string;
  CODE?: number;
};
