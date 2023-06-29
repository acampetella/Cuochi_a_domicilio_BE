import express from 'express';
import CooksModel from '../models/cookModel.js';
import MenusModel from '../models/menuModel.js';
import { validationResult } from "express-validator";
import { menusValidation } from '../middlewares/validators/validateMenus.js';
import { menusCoursesValidation } from '../middlewares/validators/validateMenusCourses.js';
import checkToken from '../middlewares/token/verifyToken.js';

const menus = express.Router();

//restituzione di tutti i menù relativi ad uno specifico cuoco
menus.get('/menus/:cookId', async (req, res) => {
    const { page = 1, pageSize = 3} = req.query;
    try {
        const {cookId} = req.params;
        const cookExists = await CooksModel.findById(cookId);
        if (!cookExists) {
            return res.status(404).send({
                message: 'operation failed: cook not found',
                statusCode: 404
            });
        }
        const menusList = await MenusModel.find({cook: cookId})
        .limit(pageSize)
        .skip((page - 1) * pageSize);
        const menusCount = await MenusModel.count({cook: cookId});
        res.status(200).send({
            count: menusCount,
            currentPage: Number(page),
            totalPages: Math.ceil(menusCount / Number(pageSize)),
            statusCode: 200,
            menusList
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//inserisco un menù relativo ad un cuoco
menus.post('/menus/:cookId', [menusValidation, menusCoursesValidation, checkToken], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            message: 'body validation failed',
            errors: errors.array(),
            statusCode: 400
        });
    }
    try {
        const {cookId} = req.params;
        const cookExists = await CooksModel.findById(cookId);
        if (!cookExists) {
            return res.status(404).send({
                message: 'operation failed: cook not found',
                statusCode: 404
            });
        }
        const menu = new MenusModel({
            cook: cookId,
            name: req.body.name,
            price: req.body.price,
            courses: req.body.courses
        });
        const newMenu = await menu.save();
        await CooksModel.findByIdAndUpdate(cookId, {$push: {menus: newMenu._id}});
        res.status(201).send({
            message: 'menu created',
            statusCode: 201
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

//elimino uno specifico menù
menus.delete('/menus/:id', checkToken, async (req, res) => {
    try {
        const {id} = req.params;
        const menuExists = await MenusModel.findByIdAndDelete(id);
        if (!menuExists) {
            return res.status(404).send({
                message: 'operation failed: menu not found',
                statusCode: 404
            });
        }
        await CooksModel.findByIdAndUpdate(menuExists.cook, {$pull: {menus: id}});
        res.status(200).send({
            message: 'menu removed',
            statusCode: 200
        });
    } catch (error) {
        res.status(500).send({
            message: 'internal server error',
            statusCode: 500
        });
    }
});

export default menus;