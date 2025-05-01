"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const ErrorMiddleware = (error, req, res, next) => {
    try {
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        console.log(error);
        res.status(status).json({ message });
    }
    catch (error) {
        next(error);
    }
};
exports.ErrorMiddleware = ErrorMiddleware;
