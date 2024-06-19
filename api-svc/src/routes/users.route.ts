import { Router } from 'express';
import { Routes } from 'interfaces/routes.interface';

class UsersRoute implements Routes {
  public path = '/api/v1/users';
  public router = Router();
  // public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {}
}

export default UsersRoute;
