"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImportController = void 0;
const typedi_1 = require("typedi");
const productImport_service_1 = require("../services/productImport.service");
class ProductImportController {
    constructor() {
        this.service = typedi_1.Container.get(productImport_service_1.ProductImportService);
        this.import = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const products = yield this.service.import(body);
                res.status(200).json({ data: products, message: 'successful' });
            }
            catch (error) {
                next(error);
            }
        });
        this.saveInDatabase = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.service.saveInDatabase();
                res.status(200).json({ data: products, message: 'successful' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProductImportController = ProductImportController;
