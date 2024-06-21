import { NextFunction, Request, Response } from 'express';
import { UserI } from '../interfaces/users.interface';
import UserService from '../services/users.service';

class UsersController {
  public userService = new UserService();

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({ data: user, message: 'User Created' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json({ data: user, message: 'find success' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = await this.userService.updateUser(
        req.params.id,
        req.body
      );
      res.status(200).json({ data: userData, message: 'update success' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(200).json({ message: 'delete success' });
    } catch (error) {
      next(error);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = req.query.page?.toString() || '1';
      const limit = req.query.limit?.toString() || '10';
      const { users, pagination } = await this.userService.getAllUsers(
        page,
        limit
      );
      res.status(200).json({ data: users, pagination, message: 'success' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
