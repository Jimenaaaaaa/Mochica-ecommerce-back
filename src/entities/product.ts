import { Artist } from './artist';

export type AddedProduct = {
  name: string;
  price: number;
  cone: number;
  size: string;
  author: Artist;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  cone: number;
  size: string;
  author: Artist;
};
