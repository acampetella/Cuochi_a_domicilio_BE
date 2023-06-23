import {body} from 'express-validator'

export const usersValidation = [
    body('firstName').notEmpty().isString().withMessage("firstName can't be empty and must be a string"),
    body('lastName').notEmpty().isString().withMessage("lastName can't be empty and must be a string"),
    body('email').notEmpty().isEmail().withMessage("email can't be empty and must have a correct structure"),
    body('password').notEmpty().isString().withMessage("phone can't be empty and must be a string")
];