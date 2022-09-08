const router = require('express').Router();
const CategoryModel = require('../models/Category');
const categoriesController = require('../controllers/CategoriesController');

const validateCategoryId = async (req, res, next) => {
  const state = await CategoryModel.findByPk(req.params.categoryId);
  if (!state) {
    return res.status(404).json({ error: 'city not found' });
  }
  next();
}

router.get('/categories', categoriesController.index);

router.post('/categories', categoriesController.create);

router.get('/categories/:categoryId', validateCategoryId, categoriesController.show);

router.put('/categories/:categoryId', validateCategoryId, categoriesController.update);

router.delete('/categories/:categoryId', validateCategoryId, categoriesController.delete);

module.exports = router;
