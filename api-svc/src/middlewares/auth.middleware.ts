import { User } from '../models/user.model';
import { HttpException } from '../exceptions/HttpException';
import { NextFunction, Request, Response } from 'express';
import { env } from '../config';
import jwt from 'jsonwebtoken';
import {
  TokenPayload,
  AuthenticatedRequest,
} from '../interfaces/auth.interface';

const authToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException(401, 'No token provided');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as TokenPayload;
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export { authToken };
