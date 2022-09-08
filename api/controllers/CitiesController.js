const { Op } = require('sequelize');
const StateModel = require('../models/State.js');
const CityModel = require('../models/City.js');


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
        order: [ [sort, order] ],
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
      res.json({});
    }
  
    _validateData = async (data, id) => {
      const attributes = ['name', 'StateId'];
      const city = {};
      for (const attribute of attributes) {
        if (! data[attribute]){
          throw new Error(`The attribute "${attribute}" is required.`);
        }
        city[attribute] = data[attribute];
      }
      if (await this._checkIfCityExist(city.name, city.StateId, id)) {
        throw new Error(`The City: "${city.name}" already exists.`);
      }
  
      return city;
    }
  
    _checkIfCityExist = async (name, stateId, id) => {
      const where = {
        name: name,
        StateId: stateId
      };
  
      if (id) {
        where.id = { [Op.ne]: id }; // WHERE id != id
      }
  
      const count = await CityModel.count({
        where: where
      });
  
      return count > 0;
    }
  
  }
  
  module.exports = new CitiesController();