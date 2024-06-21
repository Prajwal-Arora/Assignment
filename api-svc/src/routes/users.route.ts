import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import UsersController from '../controllers/users.controller';
import { authToken } from '../middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.usersController.createUser);
    this.router.get(
      `${this.path}/:id`,
      authToken,
      this.usersController.getUserById
    );
    this.router.put(
      `${this.path}/:id`,
      authToken,
      this.usersController.updateUser
    );
    this.router.delete(
      `${this.path}/:id`,
      authToken,
      this.usersController.deleteUser
    );
    this.router.get(
      `${this.path}`,
      authToken,
      this.usersController.getAllUsers
    );
  }
}

export default UsersRoute;
