import { model, Schema } from 'mongoose';
import { Product } from '../../entities/product';

const productSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cone: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  author: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
    },
  ],
});

productSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    // Ver si lo del role funciona
    delete returnedObject.role;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const ProductModel = model('Product', productSchema, 'products');
