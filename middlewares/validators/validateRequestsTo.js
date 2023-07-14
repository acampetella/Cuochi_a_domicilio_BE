import { timeValidation } from "./validateTime.js";

export const requestsToValidation = (req, res, next) => {
    const {to} = req.body;
    timeValidation(to, res, next);
};