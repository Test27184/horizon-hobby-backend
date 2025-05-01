import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ProductImportService } from '../services/productImport.service';
import { ImportDto } from '../dto/import.dto';

export class ProductImportController {
  public service = Container.get(ProductImportService);

  public import = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as ImportDto;
      const products = await this.service.import(body);

      res.status(200).json({ data: products, message: 'successful' });
    } catch (error) {
      next(error);
    }
  };

  public saveInDatabase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.service.saveInDatabase();

      res.status(200).json({ data: products, message: 'successful' });
    } catch (error) {
      next(error);
    }
  };
}
