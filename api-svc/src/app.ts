import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connect } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { dbConnection } from './databases';
import { Routes } from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';

class App {
  public app: express.Application;
  public port: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = config.PORT;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info(`=================================`);
      console.info(`🚀 App listening on the port ${this.port}`);
      console.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    connect(dbConnection.url);
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
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
