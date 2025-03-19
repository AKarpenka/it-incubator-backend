import { NextFunction, Request, Response } from "express";
import { FieldValidationError, validationResult } from "express-validator";

export const errorsResultMiddleware = (
    req: Request,
    res: Response, 
    next: NextFunction,
) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(400).send({
            errorMessages: 
                errors
                    .array({onlyFirstError: true})
                    .map((error) => {
                        return { message: error.msg, field: (error as FieldValidationError).path }
                    })
        });
        
        return;
    } else {
        next();
    }
}