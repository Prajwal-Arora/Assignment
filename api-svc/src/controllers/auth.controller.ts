import { NextFunction, Request, Response } from 'express';
import { UserI } from '../interfaces/users.interface';
import AuthService from '../services/auth.service';

class AuthController {
  public authService = new AuthService();

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, existingUser } = await this.authService.logIn(req.body);
      res
        .status(200)
        .json({ token, data: existingUser, message: 'login success' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
