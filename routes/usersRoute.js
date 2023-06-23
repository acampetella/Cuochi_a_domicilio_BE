import express from 'express';
import UsersModel from '../models/userModel.js';
import { validationResult } from "express-validator";
import { usersValidation } from '../middlewares/validators/validateUsers.js';
import { usersChangeValidation } from '../middlewares/validators/validateUsersChange.js';
import { usersBirthDateValidation } from '../middlewares/validators/validateUsersBirthDate.js';
import bcrypt from 'bcrypt';

const users = express.Router();

//recupero tutti gli utenti
users.get('/users', async (req, res) => {
    const { page = 1, pageSize = 3} = req.query;
    try {
        const users = await UsersModel.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize);

        const usersCount = await UsersModel.count();
        res.status(200).send({
            count: usersCount,
            currentPage: Number(page),
            totalPages: Math.ceil(usersCount / Number(pageSize)),
            statusCode: 200,
            users
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//recupero uno specifico utente
users.get('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const userExists = await UsersModel.findById(id);
        if (!userExists) {
            return res.status(404).send({
                message: 'operation failed: user not found',
                statusCode: 404
            });
        }
        res.status(200).send({
            statusCode: 200,
            userExists
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//inserisco un utente
users.post('/users', [usersValidation, usersChangeValidation, usersBirthDateValidation], 
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
        const userExists = await UsersModel.findOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        });
        if (userExists) {
            return res.status(409).send({
                message: 'operation failed: existing user',
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
            contacts: req.body.contacts
        });
        await user.save();
        res.status(201).send({
            message: 'user created',
            statusCode: 201
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//modifico un utente
users.patch('/users/:id', [usersChangeValidation, usersBirthDateValidation], async (req, res) => {
    try {
        const {id} = req.params;
        const userExists = await UsersModel.findById(id);
        if (!userExists) {
            return res.status(404).send({
                message: 'operation failed: user not found',
                statusCode: 404
            });
        }
        const dataUpdated = req.body;
        const options = {new: true}
        await UsersModel.findByIdAndUpdate(id, dataUpdated, options);
        res.status(200).send({
            message: 'user changed',
            statusCode: 200
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//cancello utente
users.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const userExists = await UsersModel.findByIdAndDelete(id);
        if (!userExists) {
            return res.status(404).send({
                message: 'operation failed: user not found',
                statusCode: 404
            });
        }
        res.status(200).send({
            message: 'user removed',
            statusCode: 200
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
})

export default users;