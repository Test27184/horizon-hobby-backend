"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let ShopifyService = class ShopifyService {
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
};
exports.ShopifyService = ShopifyService;
exports.ShopifyService = ShopifyService = __decorate([
    (0, typedi_1.Service)()
], ShopifyService);
