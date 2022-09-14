const { Op } = require('sequelize');
const axios = require('axios');
const StateModel = require('../models/State.js');
const CityModel = require('../models/City.js');
const createlogs = require('./logs');


class CitiesController {

  index = async (req, res, next) => {
    const params = req.query;
    const limit = params.limit || 12;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    const sort = params.sort || 'id';
    const order = params.order || 'ASC';
    const where = {};

    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      };
    }

    if (params.StateId) {
      where.StateId = params.StateId;
    }

    const city = await CityModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]],
      include: [{
        model: StateModel,
        required: false,
        attributes: ['name', 'province']
      }]
    });

    res.json(city);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const city = await CityModel.create(data);
      createlogs("Create City")
      res.json(city);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const state = await CityModel.findByPk(req.params.cityId);
    res.json(state);
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.cityId;
      const data = await this._validateData(req.body, id);
      await CityModel.update(data, {
        where: {
          id: id
        }
      });
      createlogs("Update City")
      res.json(await CityModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await CityModel.destroy({
      where: {
        id: req.params.cityId
      }
    });
    createlogs("Delete City")
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['name', 'StateId', 'cep'];
    const city = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      city[attribute] = data[attribute];
    }
    if (await this._checkIfCityExist(city)) {
      throw new Error(`The City: "${city.name}" already exists.`);
    }
    return city;
  }

  _checkIfCityExist = async (city) => {
    await axios.get(`https://viacep.com.br/ws/${city.cep}/json/`).then((response) => {
        if(city.name != response.data.localidade && city.cep != response.data.cep){
          throw new Error(`The City: "${city.name}" is Invalid.`);
        }
    })

    const where = {
      name: city.name,
      StateId: city.StateId
    };

    if (city.id) {
      where.city.id = { [Op.ne]: city.id }; // WHERE id != id
    }

    const count = await CityModel.count({
      where: where
    });

    return count > 0;
  }
}

module.exports = new CitiesController();