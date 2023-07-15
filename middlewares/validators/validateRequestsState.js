export const requestsStateValidation = (req, res, next) => {
    const {state} = req.body;
    if (state !== '' && state !== undefined && state !== null) {
        if (typeof state !== "string") {
            return res.status(400).send({
                message: "state must be a string",
                statusCode: 400
            });
        } else {
            if (!checkValue(state)) {
                return res.status(400).send({
                    message: "state value error",
                    statusCode: 400
                });
            }
        }
    }
    next();
};

const checkValue = (value) => {
    let result;
    switch(value) {
        case "created":
            result = true;
            break;
        case "sent":
            result = true;
            break;
        case "accepted":
            result = true;
            break;
        case "rejected":
            result = true;
            break;
        case "confirmed":
            result = true;
            break;
        case "unconfirmed":
            result = true;
            break;
        default:
            result = false;
    }
    return result;
};
