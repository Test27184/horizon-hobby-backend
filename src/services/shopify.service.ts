import axios from "axios";
import { Service } from "typedi";
import { IProduct, IStockLevel } from "../models/product.model";
import { Media } from "../interfaces/media.interface";

@Service()
export class ShopifyService {

  async fetchDataByLink(link: string): Promise<string> {
    const response = await axios.get(link, {
      auth: {
        username: process.env.AUTH_USERNAME as string,
        password: process.env.AUTH_PASSWORD as string,
      },
    });
    return response.data.data.name
  }

async createProduct(product: IProduct) {
  const {name, isActive, longText, shortText, barcodes, prices, images, stockLevels} = product;
  const averagePrice =prices.reduce((sum, item) => sum + item.price, 0) / prices.length
  const imagesForUpload:Media[] = []
  for (const image of images) {
    imagesForUpload.push({
      mediaContentType: "IMAGE",
      originalSource: image.href,
      alt: image.type
    });
  }
  const imageForUploadToString = JSON.stringify(imagesForUpload)
    .replace(/"(\w+)":/g, '$1:')           
    .replace(/"IMAGE"/g, 'IMAGE');          
  

  const productType = await this.fetchDataByLink(product.category.link)
  const vendor = await this.fetchDataByLink(product.brand.link)
  const quantites = [{
    availableQuantity: 99999,
    locationId: `gid://shopify/Location/68934238296`
  }];
    try {
      const mutation = `mutation CreateProduct {
        productCreate(input: {
          title: "${name}"
          tags:"itemId_${product.itemId}"
          published: ${isActive}
          descriptionHtml: "${(longText || shortText || "").replace(/"/g, '\\"')}"
          productType: "${productType}"
          vendor: "${vendor}"
          variants: [
            {
              inventoryItem: {
                tracked: true

              }
              inventoryQuantities: ${JSON.stringify(quantites)}
              barcode: "${barcodes[0].barcode}"
              price: "${averagePrice}"
              sku: "${product.itemId}"
            }
          ]

          }
          media: ${imageForUploadToString}
        ) {
          product {
            id
            title
            media(first: 5) {
              edges {
                node {
                  mediaContentType
                  alt
                  ... on MediaImage {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`;
      
        const productResponse = await axios.post(
            `${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`, 
            { query: mutation.replace(/"(\w+)":/g, `$1:`) },
            {
              headers: {
                'Content-Type': 'application/json',
                "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
              },
            }
          );
          return productResponse.data.data.productCreate.product;
          
    }
    catch(e) {
        console.log(e)
        throw e;
    }
}

}