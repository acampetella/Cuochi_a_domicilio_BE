import bcrypt from "bcrypt"
import { Router } from "express"
import UserModel from "../models/userModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const login = Router();

login.post("/login", async (req, res) => {
    const user = await UserModel.findOne({email:req.body.email});
    if (!user){
        return res.status(404).send({
            message:"User not found",
            statusCode: 404
        });
    }
    //confronto tra la password inviata dall'utente con quella del DB
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send({
            message:"Password is wrong",
            statusCode: 400
        });
    }

    const token = jwt.sign({
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

    res.header('auth', token).status(200).send({
        message: "Login performed",
        statusCode: 200,
        token
    });
});

export default login;