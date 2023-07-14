export const dateValidation = (date, res, next) => {
    if (date !== '' && date !== undefined && date !== null) {
        if (typeof date !== "string") {
            return res.status(400).send({
                message: errorMessage,
                statusCode: 400
            });
        } else {
            if (!checkFormat(date)) {
                return res.status(400).send({
                    message: errorMessage,
                    statusCode: 400
                });
            }
        }
    }
    next();
};

const errorMessage = 'operation failed: date must be a string with format yyyy-mm-dd';

const checkFormat = (date) => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    const result = date.search(re);
    if (result !== -1) {
        return true;
    }
    return false;
};