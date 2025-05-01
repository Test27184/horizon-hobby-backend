import { Router } from 'express';
import { Routes } from '../interfaces/route.interface';
import { ImportDto } from '../dto/import.dto';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { ProductImportController } from '../controllers/productImport.controller';

export class ProductImportRoute implements Routes {
  public path = '/api/import';
  public router = Router();
  public controller = new ProductImportController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, ValidationMiddleware(ImportDto), this.controller.import);
    this.router.get(`${this.path}/save-in-database`, this.controller.saveInDatabase);
  }
}
