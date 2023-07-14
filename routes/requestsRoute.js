import express from 'express';
import RequestsModel from '../models/userRequestModel.js';
import UsersModel from '../models/userModel.js';
import CooksModel from '../models/cookModel.js';
import { validationResult } from "express-validator";
import { requestsValidation } from '../middlewares/validators/validateRequests.js';
import { requestsDateValidation } from '../middlewares/validators/validateRequestsDate.js';
import { requestsFromValidation } from '../middlewares/validators/validateRequestsFrom.js';
import { requestsToValidation } from '../middlewares/validators/validateRequestsTo.js';
import { requestsStateValidation } from '../middlewares/validators/validateRequestsState.js';
import checkToken from '../middlewares/token/verifyToken.js';

const requests = express.Router();

requests.get('/requests', async (req, res) => {
    const { page = 1, pageSize = 3} = req.query;
    try {
        const requests = await RequestsModel.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize)
        .populate('user', 'firstName lastName email phones')
        .populate('menu');

        const requestsCount = await RequestsModel.count();
        res.status(200).send({
            count: requestsCount,
            currentPage: Number(page),
            totalPages: Math.ceil(requestsCount / Number(pageSize)),
            statusCode: 200,
            requests
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }

});

requests.get('/requests/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const request = await RequestsModel.findById(id)
        .populate('user', 'firstName lastName email phones')
        .populate('menu');
        res.status(200).send({
            statusCode: 200,
            request
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }

});

requests.get('/requests/byUserId/:userId', async (req, res) => {
    const {userId} = req.params;
    const { page = 1, pageSize = 3} = req.query;
    try {
        const userExists = await UsersModel.findById(userId);
        if (!userExists) {
            return res.status(404).send({
                message: 'operation failed: user not found',
                statusCode: 404
            });
        }
        const requests = await RequestsModel.find({user: userId})
        .limit(pageSize)
        .skip((page - 1) * pageSize)
        .populate('user', 'firstName lastName email phones')
        .populate('menu');

        const requestsCount = await RequestsModel.count();
        res.status(200).send({
            count: requestsCount,
            currentPage: Number(page),
            totalPages: Math.ceil(requestsCount / Number(pageSize)),
            statusCode: 200,
            requests
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }

});

requests.get('/requests/byCookId/:cookId', async (req, res) => {
    const {cookId} = req.params;
    const { page = 1, pageSize = 3} = req.query;
    try {
        const cookExists = await CooksModel.findById(cookId);
        if (!cookExists) {
            return res.status(404).send({
                message: 'operation failed: cook not found',
                statusCode: 404
            });
        }
        const requests = await RequestsModel.find({cook: cookId})
        .limit(pageSize)
        .skip((page - 1) * pageSize)
        .populate('user', 'firstName lastName email phones')
        .populate('menu');

        const requestsCount = await RequestsModel.count();
        res.status(200).send({
            count: requestsCount,
            currentPage: Number(page),
            totalPages: Math.ceil(requestsCount / Number(pageSize)),
            statusCode: 200,
            requests
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }

});

requests.post('/requests', [requestsValidation, requestsDateValidation, requestsFromValidation, 
    requestsToValidation, requestsStateValidation], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            message: 'body validation failed',
            errors: errors.array(),
            statusCode: 400
        });
    }
    try {
        const requestExists = await RequestsModel.findOne({
            user: req.body.user,
            cook: req.body.cook,
            date: req.body.date,
            from: req.body.from,
            to: req.body.to
        });
        if (requestExists) {
            return res.status(409).send({
                message: 'operation failed: existing request',
                statusCode: 409
            });
        }
        const userExists = await UsersModel.findById(req.body.user);
        if (!userExists) {
            return res.status(404).send({
                message: 'operation failed: user not found',
                statusCode: 404
            });
        }
        const cookExists = await CooksModel.findById(req.body.cook);
        if (!cookExists) {
            return res.status(404).send({
                message: 'operation failed: cook not found',
                statusCode: 404
            });
        }
        const request = new RequestsModel({
            user: req.body.user,
            cook: req.body.cook,
            date: req.body.date,
            from: req.body.from,
            to: req.body.to,
            place: req.body.place,
            menu: req.body.menu,
            state: req.body.state
        });
        await request.save();
        res.status(201).send({
            message: 'request created',
            statusCode: 201
        });
    } catch (error) {
        res.status(500).send({
            message: 'int{ernal server error',
            statusCode: 500
        });
    }
});

requests.patch('/requests/:id', [requestsStateValidation], async (req, res) => {
    const {id} = req.params;
    try {
        const requestExists = await RequestsModel.findById(id);
        if (!requestExists) {
            return res.status(404).send({
                message: 'operation failed: request not found',
                statusCode: 404
            });
        }
        const dataUpdated = req.body;
        const options = {new: true}
        await RequestsModel.findByIdAndUpdate(id, dataUpdated, options);
        res.status(200).send({
            message: 'request changed',
            statusCode: 200
        }); 
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }

});

requests.delete('/requests/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const requestExists = await RequestsModel.findByIdAndDelete(id);
        if (!requestExists) {
            return res.status(404).send({
                message: 'operation failed: request not found',
                statusCode: 404
            });
        }
        res.status(200).send({
            message: 'request removed',
            statusCode: 200
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});


export default requests;