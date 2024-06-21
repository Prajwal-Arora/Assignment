import { Request } from 'express';
import { UserI } from './users.interface';

export interface AuthenticatedRequest extends Request {
  token?: string;
  user?: UserI;
}

export interface TokenPayload {
  _id: string;
}
