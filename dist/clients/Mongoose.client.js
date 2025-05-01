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
exports.MongooseClient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.set('runValidators', true);
mongoose_1.default.connection.on('connecting', () => {
    console.log('Connecting to MongoDB...');
});
mongoose_1.default.connection.on('connected', () => {
    console.log('MongoDB connected!');
});
mongoose_1.default.connection.on('open', function () {
    console.log('MongoDB connection opened!');
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');
});
mongoose_1.default.connection.on('close', function () {
    console.log('Connection to MongoDB is closed');
});
mongoose_1.default.connection.on('error', error => {
    console.error('Error connecting to MongoDB: ' + error);
});
exports.MongooseClient = {
    connect: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (debug = false) {
        try {
            if (debug) {
                mongoose_1.default.set('debug', true);
            }
            yield mongoose_1.default.connect(process.env.DB_CONNECTION_STRING, {
                dbName: process.env.DB_DATABASE,
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
        return mongoose_1.default;
    }),
    disconnect: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connection.close();
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
        return mongoose_1.default;
    }),
    isConnected: () => Number(mongoose_1.default.connection.readyState) === 1,
};
