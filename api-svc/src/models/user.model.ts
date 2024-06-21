import { model, Schema, Document } from 'mongoose';
import { UserI } from '../interfaces/users.interface';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model<UserI & Document>('User', userSchema);

export { User };
