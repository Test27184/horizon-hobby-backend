import express from 'express';
import cors from 'cors'
import dotenv from "dotenv";
import { Routes } from './interfaces/route.interface';
import { ErrorMiddleware } from './middlewares/error.middleware';
import 'reflect-metadata';


dotenv.config();

export class App {
  public app: express.Application;

  constructor(routes: Routes[]) {
    this.app = express();

    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.initializeRoutes(routes);
    this.initializeErrorHandling();
   

  }

  public listen() {
    return this.app.listen(process.env.PORT, () => {
      console.log(`=================================`);
      console.log(`🚀 App listening on the port ${process.env.PORT}`);
      console.log(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }


  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use(route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
