import { Service } from 'typedi';
import { Container } from 'typedi';
import { ShopifyService } from './shopify.service';

@Service()
export class ProductExportService {
    public shopifyService = Container.get(ShopifyService);

    public async export() {
        return this.shopifyService.exportProductsToCsv();
    }

    
}
