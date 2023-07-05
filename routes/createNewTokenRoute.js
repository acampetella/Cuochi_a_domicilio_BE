import { Router } from "express";
import UserModel from "../models/userModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import checkToken from '../middlewares/token/verifyToken.js';

dotenv.config();

const createNewToken = Router();

createNewToken.post("/getNewToken", checkToken, async (req, res) => {
    const user = await UserModel.findOne({email:req.body.email});
    if (!user){
        return res.status(404).send({
            message:"Operation failed: user not found",
            statusCode: 404
        });
    }
    const newToken = jwt.sign({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        avatar: user.avatar,
        cover: user.cover,
        phones: user.phones,
        role: user.role
    }, process.env.SECRET_JWT_KEY, {
        expiresIn: '24h'
    });

    res.header('Auth', newToken).status(200).send({
        message: "New token created",
        statusCode: 200,
        newToken
    });
});

export default createNewToken;