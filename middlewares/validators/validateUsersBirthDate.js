export const usersBirthDateValidation = (req, res, next) => {
    const {birthDate} = req.body;
    if (birthDate !== '' && birthDate !== undefined && birthDate !== null) {
        if (typeof birthDate !== "string") {
            return res.status(400).send({
                message: errorMessage,
                statusCode: 400
            });
        } else {
            if (!checkFormat(birthDate)) {
                return res.status(400).send({
                    message: errorMessage,
                    statusCode: 400
                });
            }
        }
    }
    next();
};

const errorMessage = 'operation failed: birthDate must be a string with format yyyy-mm-dd';

const checkFormat = (date) => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    const result = date.search(re);
    if (result !== -1) {
        return true;
    }
    return false;
};