"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductExportRoute = void 0;
const express_1 = require("express");
const productExport_controller_1 = require("../controllers/productExport.controller");
class ProductExportRoute {
    constructor() {
        this.path = '/api/export';
        this.router = (0, express_1.Router)();
        this.controller = new productExport_controller_1.ProductExportController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, this.controller.export);
    }
}
exports.ProductExportRoute = ProductExportRoute;
