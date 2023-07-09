import express from 'express';
import CooksModel from '../models/cookModel.js';
import UsersModel from '../models/userModel.js';
import { validationResult } from "express-validator";
import { usersValidation } from '../middlewares/validators/validateUsers.js';
import { usersChangeValidation } from '../middlewares/validators/validateUsersChange.js';
import { usersBirthDateValidation } from '../middlewares/validators/validateUsersBirthDate.js';
import bcrypt from 'bcrypt';
import checkToken from '../middlewares/token/verifyToken.js';

const cooks = express.Router();

//restituzione di tutti i cuochi
cooks.get('/cooks', async (req, res) => {
    const { page = 1, pageSize = 3} = req.query;
    try {
        const cooks = await CooksModel.find()
        .populate('user', 'firstName lastName birthDate email avatar cover phones')
        .populate('menus')
        .limit(pageSize)
        .skip((page - 1) * pageSize);

        const cooksCount = await CooksModel.count();
        res.status(200).send({
            count: cooksCount,
            currentPage: Number(page),
            totalPages: Math.ceil(cooksCount / Number(pageSize)),
            statusCode: 200,
            cooks
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//restituzione di un singolo cuoco
cooks.get('/cooks/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const cookExists = await CooksModel.findById(id)
        .populate('user', 'firstName lastName birthDate email avatar cover phones')
        .populate('menus');
        if (!cookExists) {
            return res.status(404).send({
                message: 'operation failed: cook not found',
                statusCode: 404
            });
        }
        res.status(200).send({
            statusCode: 200,
            cookExists
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//restituzione di un singolo cuoco attraverso l'id utente
cooks.get('/cooks/byUserId/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const cookExists = await CooksModel.findOne({user: userId})
        .populate('user', 'firstName lastName birthDate email avatar cover phones')
        .populate('menus');
        if (!cookExists) {
            return res.status(404).send({
                message: 'operation failed: cook not found',
                statusCode: 404
            });
        }
        res.status(200).send({
            statusCode: 200,
            cookExists
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//inserimento di un cuoco
cooks.post('/cooks', [usersValidation, checkToken, usersChangeValidation, usersBirthDateValidation], 
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            message: 'body validation failed',
            errors: errors.array(),
            statusCode: 400
        });
    }
    try {
        const cookExists = await UsersModel.findOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        });
        if (cookExists) {
            return res.status(409).send({
                message: 'operation failed: existing cook',
                statusCode: 409
            });
        }
        const password = req.body.password;
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);
        const user = new UsersModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: req.body.birthDate,
            email: req.body.email,
            avatar: req.body.avatar,
            cover: req.body.cover,
            password: hashedPassword,
            phones: req.body.phones,
            role: "cook"
        });
        await user.save();
        const cook = await UsersModel.findOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        });
        const newCook = new CooksModel({
            user: cook._id
        });
        await newCook.save();
        res.status(201).send({
            message: 'cook created',
            statusCode: 201
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//modifica di un cuoco
cooks.patch('/cooks/:id', checkToken, async (req, res) => {
    try {
        const {id} = req.params;
        const cookExists = await CooksModel.findById(id);
        if (!cookExists) {
            return res.status(404).send({
                message: 'operation failed: cook not found',
                statusCode: 404
            });
        }
        const dataUpdated = req.body;
        const options = {new: true}
        await CooksModel.findByIdAndUpdate(id, dataUpdated, options);
        res.status(200).send({
            message: 'cook changed',
            statusCode: 200
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//cancellazione di un cuoco
cooks.delete('/cooks/:id', checkToken, async (req, res) => {
    try {
        const {id} = req.params;
        const cookExists = await CooksModel.findById(id);
        if (!cookExists) {
            return res.status(404).send({
                message: 'operation failed: cook not found',
                statusCode: 404
            });
        }
        await CooksModel.findByIdAndDelete(id);
        console.log(cookExists.user);
        await UsersModel.findByIdAndDelete(cookExists.user);
        res.status(200).send({
            message: 'cook removed',
            statusCode: 200
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

export default cooks;
