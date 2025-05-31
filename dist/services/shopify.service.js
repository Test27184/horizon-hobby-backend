"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyService = void 0;
const axios_1 = __importDefault(require("axios"));
const typedi_1 = require("typedi");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ShopifyService = class ShopifyService {
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            let allProducts = [];
            let since_id = "0";
            const limit = 250; // Max products per page for REST API
            while (true) {
                const url = `${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/products.json?limit=${limit}&since_id=${since_id}`;
                try {
                    const response = yield axios_1.default.get(url, {
                        headers: {
                            'Content-Type': 'application/json',
                            "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
                        },
                    });
                    const products = response.data.products;
                    if (products && products.length > 0) {
                        allProducts = allProducts.concat(products);
                        since_id = products[products.length - 1].id.toString();
                    }
                    else {
                        // No more products to fetch
                        break;
                    }
                }
                catch (error) {
                    console.error("Error fetching products from Shopify REST API:", error);
                    // Depending on how you want to handle errors, you might re-throw,
                    // return partial data, or an empty array.
                    throw new Error("Failed to fetch products from Shopify via REST API.");
                }
            }
            return allProducts;
        });
    }
    fetchDataByLink(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(link, {
                auth: {
                    username: process.env.AUTH_USERNAME,
                    password: process.env.AUTH_PASSWORD,
                },
            });
            return response.data.data.name;
        });
    }
    createProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, isActive, longText, shortText, barcodes, prices, images, stockLevels } = product;
            const averagePrice = prices.reduce((sum, item) => sum + item.price, 0) / prices.length;
            const imagesForUpload = [];
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
            const productType = yield this.fetchDataByLink(product.category.link);
            const vendor = yield this.fetchDataByLink(product.brand.link);
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
                const productResponse = yield axios_1.default.post(`${process.env.SHOPIFY_STORE_URL}/admin/api/2024-04/graphql.json`, { query: mutation.replace(/"(\w+)":/g, `$1:`) }, {
                    headers: {
                        'Content-Type': 'application/json',
                        "X-Shopify-Access-Token": process.env.SHOPIFY_API_KEY,
                    },
                });
                return productResponse.data.data.productCreate.product;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    exportProductsToCsv() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.getProducts();
            if (!products || products.length === 0) {
                const message = "No products found to export.";
                return { filePath: "", productsCount: 0, message };
            }
            const headers = [
                "Handle", "Title", "Body(HTML)", "Vendor", "Type", "Published",
                "SKU", "Price", "Compare At Price", "Barcode", "Image Src",
                "Weight Unit", "Status"
            ];
            const escapeCsvField = (field) => {
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
                return { filePath, productsCount: products.length, message: "Products exported successfully to" };
            }
            catch (error) {
                console.error(`Error writing CSV file to ${filePath}:`, error);
                throw error;
            }
        });
    }
};
exports.ShopifyService = ShopifyService;
exports.ShopifyService = ShopifyService = __decorate([
    (0, typedi_1.Service)()
], ShopifyService);
