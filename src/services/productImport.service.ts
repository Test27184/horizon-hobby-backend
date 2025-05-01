import axios from "axios";
import Container, { Service } from "typedi";
import { HttpException } from "../exceptions/httpException";
import { ImportDto } from "../dto/import.dto";
import { ShopifyService } from "./shopify.service";
import { ProductModel } from "../models/product.model";

@Service()
export class ProductImportService {
    public shopifyService = Container.get(ShopifyService);

    async sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    public async import(body: ImportDto): Promise<{ notFoundProductIds: string[], foundProductIds: string[] }> {
      const { productIds } = body;
      const notFoundProductIds = [];
      const foundProductIds = [];
      let count = 0;
    
      for (const productId of productIds) {
        const foundProduct = await ProductModel.findOne({ itemId: productId });
        if (!foundProduct) {
          console.log(`Product ${productId} not found`);
          notFoundProductIds.push(productId);
          continue;
        }
    
        try {
          const product = await this.shopifyService.createProduct(foundProduct);
          count++;
          console.log({ count, productId, product });
    
          await this.sleep(3000);
          foundProductIds.push(productId);
        } catch (error) {
          console.error(`Failed to create product ${productId}:`, error);
          notFoundProductIds.push(productId);
        }
      }
    
      count = 0;
      console.log('Not found product ids',notFoundProductIds);
      console.log('Found product ids',foundProductIds);
      return { notFoundProductIds, foundProductIds };
    }

    async saveInDatabase() {
        let offset = 0;
        let hasMore = true;
       
      
        try {
          while (hasMore ) {
            const response = await axios.get(`${process.env.ALL_PRODUCTS_URL}?limit=2500&offset=${offset}`, {
                auth: {
                  username: process.env.AUTH_USERNAME as string,
                  password: process.env.AUTH_PASSWORD as string,
                },
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              
      
            const products = response.data.data || [];
      
            if (!Array.isArray(products) || products.length === 0) {
              hasMore = false;
            } else {
              for (const product of products) {
                const productData = new ProductModel({
                  itemId: product.id,
                  language: product.language,
                  isActive: product.isActive,
                  status: product.status,
                  salesMultiple: product.salesMultiple,
                  hazardousCode: product.hazardousCode, 
                  isInStoreOnly: product.isInStoreOnly,
                  discontinuedDate: product.discontinuedDate,
                  productLine: product.productLine,
                  isGiftWrappable: product.isGiftWrappable,
                  oversideCode: product.oversideCode,
                  parentItem: product.parentItem,
                  category: product.category,
                  brand: product.brand,
                  reorderItem: product.reorderItem,
                  eta: product.eta,
                  orderDeadline: product.orderDeadline,
                  countryOfOrigin: product.countryOfOrigin, 
                  commodityCode: product.commodityCode,
                  weeeItem: product.weeeItem,
                  name: product.name,
                  shortText: product.shortText,
                  longText: product.longText,
                  allowBackorders: product.allowBackorders,
                  prices: product.prices,
                  images: product.images,
                  stockLevels: product.stockLevels,
                  dimensions: product.dimensions,
                  barcodes: product.barcodes,
                  batteryWeights: product.batteryWeights, 
                  partLists: product.partLists,
                  manufacturerItemNumbers: product.manufacturerItemNumbers,
                  partsExplosions: product.partsExplosions,
                  lastUpdated: product.lastUpdated,
                  deleted: product.deleted,
                  link: product.link,
                });
                await ProductModel.findOneAndUpdate(
                  { itemId: productData.itemId },
                  productData,
                  {
                    new: true,
                    upsert: true
                  }
                );
              }
              offset+=2500;
            }
          }
      
        } catch (error: any) {
          console.error('Error fetching products:', error.response?.data || error.message);
          throw new HttpException(404, error.message || 'Failed to fetch products');
        }
      }
        
      
      
}