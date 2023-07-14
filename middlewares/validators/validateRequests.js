import {body} from 'express-validator'

export const requestsValidation = [
    body('place.street').notEmpty().isString().withMessage("street can't be empty and must be a string"),
    body('place.zipCode').notEmpty().isString().withMessage("zipCode can't be empty and must be a string"),
    body('place.town').notEmpty().isString().withMessage("town can't be empty and must be a string"),
    body('place.province').notEmpty().isString().withMessage("province can't be empty and must be a string"),
    body('state').notEmpty().isString().withMessage("state can't be empty and must be a string")
];