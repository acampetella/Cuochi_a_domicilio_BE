export const requestsOwnerValidation = (req, res, next) => {
    const {owner} = req.body;
    if (owner !== '' && owner !== undefined && owner !== null) {
        if (typeof owner !== "string") {
            return res.status(400).send({
                message: "owner must be a string",
                statusCode: 400
            });
        } else {
            if (!checkValue(owner)) {
                return res.status(400).send({
                    message: "owner value error",
                    statusCode: 400
                });
            }
        }
    }
    next();
};

const checkValue = (value) => {
    if (value === 'user' || value === 'cook' || value === 'nobody') {
        return true;
    }
    return false;
};
