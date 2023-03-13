import { model, Schema } from 'mongoose';
import { User } from '../../entities/user';

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: false,
  },
  street: {
    type: String,
    required: false,
  },
  PC: {
    type: String,
    required: false,
  },
  IBAN: {
    type: String,
    required: false,
  },
  Code: {
    type: String,
    required: false,
  },
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users');
