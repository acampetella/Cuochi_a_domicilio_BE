import { timeValidation } from "./validateTime.js";

export const requestsFromValidation = (req, res, next) => {
    const {from} = req.body;
    timeValidation(from, res, next);
};