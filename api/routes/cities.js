const router = require('express').Router();
const CityModel = require('../models/City');
const citiesController = require('../controllers/CitiesController');

const validateCityId = async (req, res, next) => {
  const state = await CityModel.findByPk(req.params.cityId);
  if (!state) {
    return res.status(404).json({ error: 'city not found' });
  }
  next();
}

router.get('/cities', citiesController.index);

router.post('/cities', citiesController.create);

router.get('/cities/:cityId', validateCityId, citiesController.show);

router.put('/cities/:cityId', validateCityId, citiesController.update);

router.delete('/cities/:cityId', validateCityId, citiesController.delete);

module.exports = router;
