import 'express-async-errors';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { connect } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import { env } from './config';
import { Routes } from './interfaces/routes.interface';
import { errorMiddleware } from './middlewares/error.middleware';
import path from 'path';

class App {
  public app: express.Application;
  public port: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = env.PORT;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }

  private connectToDatabase() {
    connect(env.MONGODB_CONNECTION_STRING).then(() => {
      console.log('Connected to database ✅');
    });
  }

  private initializeMiddlewares() {
    this.app.use(cors({ origin: '*' }));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 10,
        message: 'API calls limit exceeded',
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      })
    );
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
    this.app.get('/healthcheck', (req: Request, res: Response) => {
      res.json({ message: 'hello' });
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'User Management API',
          version: '1.0.0',
          description: 'API for managing users',
        },
        servers: [
          {
            url: 'http://localhost:3001',
            description: 'Local server',
          },
        ],
      },
      apis: [path.join(__dirname, 'swagger.yaml')],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
