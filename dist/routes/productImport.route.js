"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImportRoute = void 0;
const express_1 = require("express");
const import_dto_1 = require("../dto/import.dto");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const productImport_controller_1 = require("../controllers/productImport.controller");
class ProductImportRoute {
    constructor() {
        this.path = '/api/import';
        this.router = (0, express_1.Router)();
        this.controller = new productImport_controller_1.ProductImportController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, (0, validation_middleware_1.ValidationMiddleware)(import_dto_1.ImportDto), this.controller.import);
        this.router.get(`${this.path}/save-in-database`, this.controller.saveInDatabase);
    }
}
exports.ProductImportRoute = ProductImportRoute;
