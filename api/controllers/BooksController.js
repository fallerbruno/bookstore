const { Op } = require('sequelize');
const CityModel = require('../models/City');
const StateModel = require('../models/State.js');
const PublisherModel = require('../models/Publisher');
const BookModel = require('../models/Book');
const CategoryModel = require('../models/Category');

class BooksController {

    index = async (req, res, next) => {
        const params = req.query;
        const limit = params.limit || 12;
        const page = params.page || 1;
        const offset = (page - 1) * limit;
        const sort = params.sort || 'id';
        const order = params.order || 'ASC';
        const where = {};

        if (params.title) {
            where.title = {
                [Op.iLike]: `%${params.title}%`
            };
        }

        if (params.author) {
            where.author = {
                [Op.iLike]: `%${params.author}%`
            };
        }

        if (params.min_pages) {
            where.pages = {
                [Op.gte]: params.min_pages
            };
        }

        if (params.max_pages) {
            if (!where.pages) {
                where.pages = {};
            }
            where.pages[Op.lte] = params.max_pages;
        }

        if (params.min_publication_year) {
            where.publication_year = {
                [Op.gte]: params.min_publication_year
            };
        }

        if (params.max_publication_year) {
            if (!where.publication_year) {
                where.publication_year = {};
            }
            where.publication_year[Op.lte] = params.max_publication_year;
        }

        const book = await BookModel.findAll({
            where: where,
            limit: limit,
            offset: offset,
            order: [[sort, order]],
            include: [{
                model: CategoryModel,
                requried: false,
                attributes: ['description'],
            }, {
                model: PublisherModel,
                requried: false,
                attributes: ['name'],
                include: {
                    model: CityModel,
                    required: false,
                    attributes: ['name'],
                    include: {
                        model: StateModel,
                        required: false,
                        attributes: ['name', 'province']
                    }
                },
            }],
        });
        res.json(book);
    }

    create = async (req, res, next) => {
        try {
            const data = await this._validateData(req.body);
            const book = await BookModel.create(data);
            res.json(book);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    show = async (req, res, next) => {
        const book = await BookModel.findByPk(req.params.bookId);
        res.json(book);
    }

    update = async (req, res, next) => {
        try {
            const id = req.params.bookId;
            const data = await this._validateData(req.body, id);
            await BookModel.update(data, {
                where: {
                    id: id
                }
            });
            res.json(await BookModel.findByPk(id));
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    delete = async (req, res, next) => {
        await BookModel.destroy({
            where: {
                id: req.params.bookId
            }
        });
        res.json({});
    }

    _validateData = async (data, id) => {
        const attributes = ['title', 'author', 'publication_year', 'pages', 'CategoryId', 'PublisherId'];
        const book = {};
        for (const attribute of attributes) {
            if (!data[attribute]) {
                throw new Error(`The attribute "${attribute}" is required.`);
            }
            book[attribute] = data[attribute];
        }
        return book;
    }
}

module.exports = new BooksController();