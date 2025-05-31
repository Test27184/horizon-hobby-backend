import { Router } from 'express';
import { Routes } from '../interfaces/route.interface';
import { ProductExportController } from '../controllers/productExport.controller';

export class ProductExportRoute implements Routes {
  public path = '/api/export';
  public router = Router();
  public controller = new ProductExportController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.controller.export);
  }
}
