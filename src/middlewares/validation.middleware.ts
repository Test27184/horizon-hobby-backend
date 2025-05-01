import { NextFunction, Request, Response } from 'express';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpException } from '../exceptions/httpException';

export const prettierErrorMessage = (error:any) => {
    try {
      if (error.constraints) {
        if (error.constraints.unknownValue) {
          return `constraints:${JSON.stringify(error.constraints)}, target:${JSON.stringify(error.target)}`;
        }
        return `key:${error.property}, value:${error.value}, constraints:${JSON.stringify(error.constraints)}`;
      } else if (error.children && error.children.length > 0) {
        return error.children.map(prettierErrorMessage).join('; ');
      }
    } catch (e) {}
  
    return JSON.stringify(error);
  };

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (
  type: any,
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new HttpException(400, 'Request body cannot be empty'));
    }
    
    const dto = plainToInstance(type, req.body);
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = Array.isArray(errors) ? errors.map(prettierErrorMessage).join('; ') : String(errors);
        next(new HttpException(400, message));
      });
  };
};

/**
 * @name ValidationQPMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationQPMiddleware = (
  type: any,
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.query);
    if (dto instanceof Object) {
      validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
        .then(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          req.query = dto;
          next();
        })
        .catch((errors: ValidationError[]) => {
          const message = Array.isArray(errors) ? errors.map(prettierErrorMessage).join('; ') : String(errors);
          next(new HttpException(400, message));
        });
    } else {
      next(new HttpException(400, 'Query parameters are not valid.'));
    }
  };
};
