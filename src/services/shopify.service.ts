import axios from "axios";
import { Service } from "typedi";
import { IProduct } from "../models/product.model";
import { Media } from "../interfaces/media.interface";
import * as fs from 'fs';
import * as path from 'path';

@Service()
export class ShopifyService {

  async getProducts() {
    let allProducts: any[] = [];
    let since_id = "0";
    const limit = 250; // Max products per page for REST API

    while (true) {
      const url = `${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/products.json?limit=${limit}&since_id=${since_id}`;
      
      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
          },
        });

        const products = response.data.products;

        if (products && products.length > 0) {
          allProducts = allProducts.concat(products);
          since_id = products[products.length - 1].id.toString();
        } else {
          // No more products to fetch
          break;
        }
      } catch (error) {
        console.error("Error fetching products from Shopify REST API:", error);
        // Depending on how you want to handle errors, you might re-throw,
        // return partial data, or an empty array.
        throw new Error("Failed to fetch products from Shopify via REST API.");
      }
    }
    return allProducts;
  }
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

  async exportProductsToCsv(): Promise<{filePath: string, productsCount: number, message: string}> {
    const products: any[] = await this.getProducts();

    if (!products || products.length === 0) {
      const message = "No products found to export.";
      return {filePath: "", productsCount: 0, message}; 
    }

    const headers = [
      "Handle", "Title", "Body(HTML)", "Vendor", "Type", "Published",
      "SKU", "Price", "Compare At Price", "Barcode", "Image Src",
      "Weight Unit", "Status"
    ];

    const escapeCsvField = (field: any): string => {
      const str = String(field === null || typeof field === 'undefined' ? "" : field);
      return '"' + str.replace(/"/g, '""') + '"';
    };

    const csvRows = products.map(product => {
      const variant = product.variants && product.variants.length > 0 ? product.variants[0] : {};
      const imageSrc = (product.image && product.image.src) || 
                       (product.images && product.images.length > 0 && product.images[0] && product.images[0].src) || 
                       "";
      
      const isPublished = product.status === 'active';


      return [
        escapeCsvField(product.handle),
        escapeCsvField(product.title),
        escapeCsvField(product.body_html),
        escapeCsvField(product.vendor),
        escapeCsvField(product.product_type),
        escapeCsvField(isPublished ? "true" : "false"),
        escapeCsvField(variant.sku),
        escapeCsvField(variant.price),
        escapeCsvField(variant.compare_at_price),
        escapeCsvField(variant.barcode),
        escapeCsvField(imageSrc),
        escapeCsvField(variant.weight_unit),
        escapeCsvField(product.status)
      ].join(',');
    });

    const csvContent = [headers.map(escapeCsvField).join(','), ...csvRows].join('\n');

    const exportsDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
      console.log(`Created directory: ${exportsDir}`);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(exportsDir, `shopify_products_${timestamp}.csv`);
    
    try {
      fs.writeFileSync(filePath, csvContent, 'utf8');
      console.log(`Products exported successfully to ${filePath}`);
      return {filePath, productsCount: products.length, message: "Products exported successfully to"};
    } catch (error) {
      console.error(`Error writing CSV file to ${filePath}:`, error);
      throw error; 
    }
  }
}