import {body} from 'express-validator'

export const menusValidation = [
    body('name').notEmpty().isString().withMessage("name can't be empty and must be a string"),
    body('price').notEmpty().isNumeric().withMessage("price can't be empty and must be a number")
];