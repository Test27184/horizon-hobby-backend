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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const Mongoose_client_1 = require("./clients/Mongoose.client");
const routes_1 = __importDefault(require("./routes"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = new app_1.App(routes_1.default);
    //@ts-ignore
    yield Mongoose_client_1.MongooseClient.connect(process.env.isDebugMode);
    const server = app.listen();
    server.setTimeout(18000000); // 30 minutes
}))();
