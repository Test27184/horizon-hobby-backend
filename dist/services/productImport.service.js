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
exports.ProductImportService = void 0;
const axios_1 = __importDefault(require("axios"));
const typedi_1 = __importStar(require("typedi"));
const httpException_1 = require("../exceptions/httpException");
const shopify_service_1 = require("./shopify.service");
const product_model_1 = require("../models/product.model");
let ProductImportService = class ProductImportService {
    constructor() {
        this.shopifyService = typedi_1.default.get(shopify_service_1.ShopifyService);
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    import(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productIds } = body;
            const notFoundProductIds = [];
            const foundProductIds = [];
            let count = 0;
            for (const productId of productIds) {
                const foundProduct = yield product_model_1.ProductModel.findOne({ itemId: productId });
                if (!foundProduct) {
                    console.log(`Product ${productId} not found`);
                    notFoundProductIds.push(productId);
                    continue;
                }
                try {
                    const product = yield this.shopifyService.createProduct(foundProduct);
                    count++;
                    console.log({ count, productId, product });
                    yield this.sleep(3000);
                    foundProductIds.push(productId);
                }
                catch (error) {
                    console.error(`Failed to create product ${productId}:`, error);
                    notFoundProductIds.push(productId);
                }
            }
            count = 0;
            console.log('Not found product ids', notFoundProductIds);
            console.log('Found product ids', foundProductIds);
            return { notFoundProductIds, foundProductIds };
        });
    }
    saveInDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let offset = 0;
            let hasMore = true;
            try {
                while (hasMore) {
                    const response = yield axios_1.default.get(`${process.env.ALL_PRODUCTS_URL}?limit=2500&offset=${offset}`, {
                        auth: {
                            username: process.env.AUTH_USERNAME,
                            password: process.env.AUTH_PASSWORD,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const products = response.data.data || [];
                    if (!Array.isArray(products) || products.length === 0) {
                        hasMore = false;
                    }
                    else {
                        for (const product of products) {
                            const productData = new product_model_1.ProductModel({
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
                            yield product_model_1.ProductModel.findOneAndUpdate({ itemId: productData.itemId }, productData, {
                                new: true,
                                upsert: true
                            });
                        }
                        offset += 2500;
                    }
                }
            }
            catch (error) {
                console.error('Error fetching products:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new httpException_1.HttpException(404, error.message || 'Failed to fetch products');
            }
        });
    }
};
exports.ProductImportService = ProductImportService;
exports.ProductImportService = ProductImportService = __decorate([
    (0, typedi_1.Service)()
], ProductImportService);
