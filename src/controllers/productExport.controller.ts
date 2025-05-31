import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { ProductExportService } from '../services/productExport.service';

export class ProductExportController {
  public service = Container.get(ProductExportService);

  public export = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {filePath, productsCount, message} = await this.service.export();

      res.status(200).json({ message, filePath, productsCount });
    } catch (error) {
      next(error);
    }
  };
}
