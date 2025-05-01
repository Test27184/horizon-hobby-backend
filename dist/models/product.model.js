"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
// Schemas for nested objects (optional but good practice for validation/middleware)
const ProductLinkSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    link: { type: String, required: true },
}, { timestamps: false, _id: false });
const PriceSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    type: { type: String, required: true },
    currency: { type: String, required: true },
    price: { type: Number, required: true },
    priceWithTax: { type: Number, default: null },
    minimumQuantity: { type: Number, required: true },
    mixAndMatchCode: { type: String, default: null },
    lastUpdated: { type: Date, required: true },
    link: { type: String, required: true },
}, { timestamps: false, _id: false });
const ImageSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    type: { type: String, required: true },
    href: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
    link: { type: String, required: true },
}, { timestamps: false, _id: false });
const StockLevelSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    location: { type: String, required: true },
    quantity: { type: Number, required: true },
    stockFlag: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
    link: { type: String, required: true },
}, { _id: false });
const DimensionSchema = new mongoose_1.Schema({
    unitOfMeasure: { type: String, required: true },
    quantity: { type: Number, required: true },
    lengthUnit: { type: String, required: true },
    weightUnit: { type: String, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
}, { _id: false });
const BarcodeSchema = new mongoose_1.Schema({
    barcode: { type: String, required: true },
    type: { type: String, required: true },
    unitOfMeasure: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { _id: false });
// Main Product Schema
const ProductSchema = new mongoose_1.Schema({
    itemId: { type: String, required: true },
    language: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    status: { type: String, required: true },
    salesMultiple: { type: Number, required: true },
    hazardousCode: { type: String },
    isInStoreOnly: { type: Boolean, required: true },
    discontinuedDate: { type: Date, default: null },
    productLine: { type: String, required: true },
    isGiftWrappable: { type: Boolean, required: true },
    oversideCode: { type: String, required: true },
    parentItem: { type: ProductLinkSchema, default: null },
    category: { type: ProductLinkSchema, required: true },
    brand: { type: ProductLinkSchema, required: true },
    reorderItem: { type: ProductLinkSchema, default: null },
    eta: { type: Date, default: null },
    orderDeadline: { type: Date, default: null },
    countryOfOrigin: { type: String, required: true },
    commodityCode: { type: String, required: false },
    weeeItem: { type: Boolean, required: true },
    name: { type: String, required: false },
    shortText: { type: String, default: null },
    longText: { type: String, required: false },
    allowBackorders: { type: Boolean, required: true },
    prices: [PriceSchema],
    images: [ImageSchema],
    stockLevels: [StockLevelSchema],
    dimensions: [DimensionSchema],
    barcodes: [BarcodeSchema],
    batteryWeights: [mongoose_1.SchemaTypes.Mixed],
    partLists: [mongoose_1.SchemaTypes.Mixed],
    manufacturerItemNumbers: [mongoose_1.SchemaTypes.Mixed],
    partsExplosions: [mongoose_1.SchemaTypes.Mixed],
    lastUpdated: { type: Date, required: true }, // From JSON
    deleted: { type: Boolean, required: true },
    link: { type: String, default: null }, // From JSON
}, {
    versionKey: false,
    timestamps: true, // Adds createdAt and updatedAt automatically
});
exports.ProductModel = (_a = mongoose_1.models.Product) !== null && _a !== void 0 ? _a : (0, mongoose_1.model)('Product', ProductSchema);
