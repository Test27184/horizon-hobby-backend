import { model, Model, Schema, HydratedDocument, models, SchemaTypes } from 'mongoose';
import { IPropCreatedAt, IPropUpdatedAt } from '../interfaces/common.interface';

// Interfaces for nested objects
interface IProductLink {
  id: string;
  link: string;
}

interface IPrice {
  id: number;
  type: string;
  currency: string;
  price: number;
  priceWithTax?: number | null;
  minimumQuantity: number;
  mixAndMatchCode?: string | null;
  lastUpdated: Date;
  link: string;
}

interface IImage {
  id: number;
  type: string;
  href: string;
  lastUpdated: Date;
  link: string;
}

export interface IStockLevel {
  id: string;
  location: string;
  quantity: number;
  stockFlag: string;
  lastUpdated: Date;
  link: string;
}

interface IDimension {
  unitOfMeasure: string;
  quantity: number;
  lengthUnit: string;
  weightUnit: string;
  length: number;
  width: number;
  height: number;
  weight: number;
}

interface IBarcode {
  barcode: string;
  type: string;
  unitOfMeasure: string;
  quantity: number;
}

// Main Product Interface
export interface IProduct extends IPropCreatedAt, IPropUpdatedAt {
  itemId: string; // Mapped from JSON 'id'
  language: string;
  isActive: boolean;
  status: string;
  salesMultiple: number;
  hazardousCode: string;
  isInStoreOnly: boolean;
  discontinuedDate?: Date | null;
  productLine: string;
  isGiftWrappable: boolean;
  oversideCode: string;
  parentItem?: IProductLink | null;
  category: IProductLink;
  brand: IProductLink;
  reorderItem?: IProductLink | null;
  eta?: Date | null;
  orderDeadline?: Date | null;
  countryOfOrigin: string;
  commodityCode?: string | null;
  weeeItem: boolean;
  name?: string | null;
  shortText?: string | null;
  longText?: string | null;
  allowBackorders: boolean;
  prices: IPrice[];
  images: IImage[];
  stockLevels: IStockLevel[];
  dimensions: IDimension[];
  barcodes: IBarcode[];
  batteryWeights: any[];
  partLists: any[];
  manufacturerItemNumbers: any[];
  partsExplosions: any[];
  lastUpdated: Date; // From JSON
  deleted: boolean;
  link?: string | null; // From JSON
}

export type IProductModel = Model<IProduct, {}>;

export type Product = HydratedDocument<IProduct>;

// Schemas for nested objects (optional but good practice for validation/middleware)
const ProductLinkSchema = new Schema<IProductLink>(
  {
    id: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: false, _id: false },
);

const PriceSchema = new Schema<IPrice>(
  {
    id: { type: Number, required: true },
    type: { type: String, required: true },
    currency: { type: String, required: true },
    price: { type: Number, required: true },
    priceWithTax: { type: Number, default: null },
    minimumQuantity: { type: Number, required: true },
    mixAndMatchCode: { type: String, default: null },
    lastUpdated: { type: Date, required: true },
    link: { type: String, required: true },
  },
  { timestamps: false, _id: false },
);

const ImageSchema = new Schema<IImage>(
  {
    id: { type: Number, required: true },
    type: { type: String, required: true },
    href: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
    link: { type: String, required: true },
  },
  { timestamps: false, _id: false },
);

const StockLevelSchema = new Schema<IStockLevel>(
  {
    id: { type: String, required: true },
    location: { type: String, required: true },
    quantity: { type: Number, required: true },
    stockFlag: { type: String, required: true },
    lastUpdated: { type: Date, required: true },
    link: { type: String, required: true },
  },
  { _id: false },
);

const DimensionSchema = new Schema<IDimension>(
  {
    unitOfMeasure: { type: String, required: true },
    quantity: { type: Number, required: true },
    lengthUnit: { type: String, required: true },
    weightUnit: { type: String, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
  },
  { _id: false },
);

const BarcodeSchema = new Schema<IBarcode>(
  {
    barcode: { type: String, required: true },
    type: { type: String, required: true },
    unitOfMeasure: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false },
);

// Main Product Schema
const ProductSchema: Schema = new Schema<IProduct, IProductModel>(
  {
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
    batteryWeights: [SchemaTypes.Mixed],
    partLists: [SchemaTypes.Mixed],
    manufacturerItemNumbers: [SchemaTypes.Mixed],
    partsExplosions: [SchemaTypes.Mixed],
    lastUpdated: { type: Date, required: true }, // From JSON
    deleted: { type: Boolean, required: true },
    link: { type: String, default: null }, // From JSON
  },
  {
    versionKey: false,
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

export const ProductModel: IProductModel = models.Product ?? model<IProduct, IProductModel>('Product', ProductSchema);
