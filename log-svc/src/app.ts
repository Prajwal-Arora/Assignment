import 'express-async-errors';
import express, { Request, Response } from 'express';
import { env } from './config';
import { consumeMessages } from './rabbitmq/consumer';

class App {
  public app: express.Application;
  public port: string;

  constructor() {
    this.app = express();
    this.port = env.PORT;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeRabbitMqConsumer();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    this.app.get('/healthcheck', (req: Request, res: Response) => {
      res.json({ message: 'hello' });
    });
  }

  private initializeRabbitMqConsumer() {
    consumeMessages().catch((error) => console.error(error));
  }
}

export default App;
