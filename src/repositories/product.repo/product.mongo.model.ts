import { model, Schema } from 'mongoose';
import { Product } from '../../entities/product';

const productSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number || String,
    required: true,
  },
  cone: {
    type: Number || String,
    required: true,
  },
  size: {
    type: String || Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  // Add later:
  // img: {
  //   type: Array,
  //   required: true,
  // },
  author: {
    type: String,
    required: true,
  },
});

productSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    // Ver si lo del role funciona
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const ProductModel = model('Product', productSchema, 'products');
