export const timeValidation = (time, res, next) => {
    if (time !== '' && time !== undefined && time !== null) {
        if (typeof time !== "string") {
            return res.status(400).send({
                message: errorMessage,
                statusCode: 400
            });
        } else {
            if (!checkFormat(time)) {
                return res.status(400).send({
                    message: errorMessage,
                    statusCode: 400
                });
            }
        }
    }
    next();
};

const errorMessage = 'operation failed: time must be a string with format hh-mm';

const checkFormat = (time) => {
    const re = /^\d{2}:\d{2}$/;
    const result = time.search(re);
    if (result !== -1) {
        return true;
    }
    return false;
};