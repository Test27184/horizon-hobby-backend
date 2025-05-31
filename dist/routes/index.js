"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const productImport_route_1 = require("./productImport.route");
const productExport_route_1 = require("./productExport.route");
const routes = [new productImport_route_1.ProductImportRoute(), new productExport_route_1.ProductExportRoute()];
exports.default = routes;
