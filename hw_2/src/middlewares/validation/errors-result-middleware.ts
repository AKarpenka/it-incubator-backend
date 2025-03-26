import { NextFunction, Request, Response } from "express";
import { FieldValidationError, validationResult } from "express-validator";

export const errorsResultMiddleware = (
    req: Request,
    res: Response, 
    next: NextFunction,
) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const errorArray = errors.array({onlyFirstError: true})
            .map((error) => {
                if((error as FieldValidationError).path === 'blogId' && error.msg === 'no blog') {
                    res
                    .status(404)
                    .send(`Blog for passed blogId doesn\'t exist`);
                }

                return { message: error.msg, field: (error as FieldValidationError).path }
            });

        res.status(400).send({
            errorsMessages: errorArray
        });
        
        return;
    } else {
        next();
    }
}