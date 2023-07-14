import { dateValidation } from "./validateDate.js";

export const requestsDateValidation = (req, res, next) => {
    const {date} = req.body;
    dateValidation(date, res, next);
};