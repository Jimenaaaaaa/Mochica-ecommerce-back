import { model, Schema } from 'mongoose';
import { Product } from '../../entities/product';

const userSchema = new Schema<Product>({
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

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const UserModel = model('Product', userSchema, 'products');
