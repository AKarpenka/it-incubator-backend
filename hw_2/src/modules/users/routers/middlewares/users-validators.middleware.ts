import { body } from "express-validator";
import { usersQueryRepository } from "../../repositories/users.query-repository";

export const userLoginValidator = body('login')
    .isString()
    .withMessage('Login should be string')
    .trim()
    .notEmpty()
    .withMessage('Login shouldnt be empty')
    .isLength({min: 3, max: 10})
    .withMessage('Count of symbols for login sould be between 3 and 10')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Login should include only symbols')
    .custom(async (login) => {
        const isLoginExist = await usersQueryRepository.checkFieldTaken(login);

        if(isLoginExist) {
            return Promise.reject('login already taken');
        }
    })

export const userPasswordValidator = body('password')
    .isString()
    .withMessage('Password should be string')
    .notEmpty()
    .withMessage('Password shouldnt be empty')
    .isLength({min: 6, max: 20})
    .withMessage('Count of symbols for Password sould be between 6 and 20')

export const userEmailValidator = body('email')
    .isString()
    .withMessage('Email should be string')
    .notEmpty()
    .withMessage('Email shouldnt be empty')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Email should looks like example@example.com')
    .custom(async (email) => {
        const isEmailExist = await usersQueryRepository.checkFieldTaken(email);

        if(isEmailExist) {
            return Promise.reject('Email already exist');
        }
    })

export const usersValidatorMiddleware = [
    userLoginValidator,
    userPasswordValidator,
    userEmailValidator,
];