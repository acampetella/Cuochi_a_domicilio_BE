import express from 'express';
import CooksCandidatesModel from '../models/cookCandidateModel.js';
import { validationResult } from "express-validator";
import { cooksCandidatesValidation } from '../middlewares/validators/validateCooksCandidates.js';

const cooksCandadates = express.Router();

//restituzione di tutti i cadidati cuochi
cooksCandadates.get('/cooksCandidates', async (req, res) => {
    const { page = 1, pageSize = 3} = req.query;
    try {
        const candidates = await CooksCandidatesModel.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize);

        const candidatesCount = await CooksCandidatesModel.count();
        res.status(200).send({
            count: candidatesCount,
            currentPage: Number(page),
            totalPages: Math.ceil(candidatesCount / Number(pageSize)),
            statusCode: 200,
            candidates
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//inserimento di un candidato cuoco
cooksCandadates.post('/cooksCandidates',cooksCandidatesValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            message: 'body validation failed',
            errors: errors.array(),
            statusCode: 400
        });
    }
    try {
        const cookCandidateExists = await CooksCandidatesModel.findOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        });
        if (cookCandidateExists) {
            return res.status(409).send({
                message: 'operation failed: existing candidate',
                statusCode: 409
            });
        }
        const cookCandidate = new CooksCandidatesModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            resume: req.body.resume
        });
        await cookCandidate.save();
        res.status(201).send({
            message: 'candidate created',
            statusCode: 201
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//cancellazione di un candidato cuoco
cooksCandadates.delete('/cooksCandidates/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const candidateExists = await CooksCandidatesModel.findByIdAndDelete(id);
        if (!candidateExists) {
            return res.status(404).send({
                message: 'deletion failed: candidate not found',
                statusCode: 404
            });
        }
        res.status(200).send({
            message: 'candidate removed',
            statusCode: 200
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

export default cooksCandadates;