export const usersChangeValidation = (req, res, next) => {
    const {firstName, lastName, avatar, cover} = req.body;
    if (firstName !== '' && firstName !== undefined && firstName !== null) {
        if (typeof firstName !== "string") {
            return res.status(400).send({
                message: 'operation failed: firstName must be a string',
                statusCode: 400
            });
        }
    } else if (lastName !== '' && lastName !== undefined && lastName !== null) {
        if (typeof lastName !== "string") {
            return res.status(400).send({
                message: 'operation failed: lastName must be a string',
                statusCode: 400
            });
        }
    } else if (avatar !== '' && avatar !== undefined && avatar !== null) {
        if (typeof avatar !== "string") {
            return res.status(400).send({
                message: 'operation failed: avatar must be a string',
                statusCode: 400
            });
        }
    } else if (cover !== '' && cover !== undefined && cover !== null) {
        if (typeof cover !== "string") {
            return res.status(400).send({
                message: 'operation failed: cover must be a string',
                statusCode: 400
            });
        }
    }
    next();
};