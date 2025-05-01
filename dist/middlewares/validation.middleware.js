"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationQPMiddleware = exports.ValidationMiddleware = exports.prettierErrorMessage = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const httpException_1 = require("../exceptions/httpException");
const prettierErrorMessage = (error) => {
    try {
        if (error.constraints) {
            if (error.constraints.unknownValue) {
                return `constraints:${JSON.stringify(error.constraints)}, target:${JSON.stringify(error.target)}`;
            }
            return `key:${error.property}, value:${error.value}, constraints:${JSON.stringify(error.constraints)}`;
        }
        else if (error.children && error.children.length > 0) {
            return error.children.map(exports.prettierErrorMessage).join('; ');
        }
    }
    catch (e) { }
    return JSON.stringify(error);
};
exports.prettierErrorMessage = prettierErrorMessage;
/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
const ValidationMiddleware = (type, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
    return (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(new httpException_1.HttpException(400, 'Request body cannot be empty'));
        }
        const dto = (0, class_transformer_1.plainToInstance)(type, req.body);
        (0, class_validator_1.validateOrReject)(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
            .then(() => {
            req.body = dto;
            next();
        })
            .catch((errors) => {
            const message = Array.isArray(errors) ? errors.map(exports.prettierErrorMessage).join('; ') : String(errors);
            next(new httpException_1.HttpException(400, message));
        });
    };
};
exports.ValidationMiddleware = ValidationMiddleware;
/**
 * @name ValidationQPMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
const ValidationQPMiddleware = (type, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
    return (req, res, next) => {
        const dto = (0, class_transformer_1.plainToInstance)(type, req.query);
        if (dto instanceof Object) {
            (0, class_validator_1.validateOrReject)(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
                .then(() => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                req.query = dto;
                next();
            })
                .catch((errors) => {
                const message = Array.isArray(errors) ? errors.map(exports.prettierErrorMessage).join('; ') : String(errors);
                next(new httpException_1.HttpException(400, message));
            });
        }
        else {
            next(new httpException_1.HttpException(400, 'Query parameters are not valid.'));
        }
    };
};
exports.ValidationQPMiddleware = ValidationQPMiddleware;
