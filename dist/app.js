"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = require("./middlewares/error.middleware");
require("reflect-metadata");
dotenv_1.default.config();
class App {
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }
    listen() {
        return this.app.listen(process.env.PORT, () => {
            console.log(`=================================`);
            console.log(`🚀 App listening on the port ${process.env.PORT}`);
            console.log(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    initializeRoutes(routes) {
        routes.forEach(route => {
            this.app.use(route.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.ErrorMiddleware);
    }
}
exports.App = App;
