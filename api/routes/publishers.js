const router = require('express').Router();
const PublisherModel = require('../models/Publisher');
const publisherController = require('../controllers/PublishersController');

const validatePublisherId = async (req, res, next) => {
  const publisher = await PublisherModel.findByPk(req.params.publisherId);
  if (!publisher) {
    return res.status(404).json({ error: 'publisher not found' });
  }
  next();
}

router.get('/publishers', publisherController.index);

router.post('/publishers', publisherController.create);

router.get('/publishers/:publisherId', validatePublisherId, publisherController.show);

router.put('/publishers/:publisherId', validatePublisherId, publisherController.update);

router.delete('/publishers/:publisherId', validatePublisherId, publisherController.delete);

module.exports = router;
