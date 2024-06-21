import { validateUserParams } from '../utils/validator';
import { hash, compare } from 'bcrypt';
import { UserI } from '../interfaces/users.interface';
import { HttpException } from '../exceptions/HttpException';
import { User } from '../models/user.model';
import { env } from '../config';
import jwt from 'jsonwebtoken';

class AuthService {
  public async logIn(
    userData: UserI
  ): Promise<{ token: string; existingUser: UserI }> {
    const { error } = validateUserParams(userData);
    if (error) throw new HttpException(400, error.details[0].message);

    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      throw new HttpException(409, 'Invalid email');
    }
    const passwordsMatch = await compare(
      userData.password,
      existingUser.password
    );
    if (!passwordsMatch) {
      throw new HttpException(409, 'Invalid password');
    }
    const token = jwt.sign(
      {
        _id: existingUser._id,
      },
      env.JWT_SECRET_KEY,
      {
        expiresIn: '1h',
      }
    );
    return { token, existingUser };
  }
}

export default AuthService;
