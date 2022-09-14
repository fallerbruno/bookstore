const router = require('express').Router();
const FormatModel = require('../models/Format');
const formatController = require('../controllers/FormatController');

const validateFormatId = async (req, res, next) => {
    const format = await FormatModel.findByPk(req.params.formatId);
    if (!format) {
        return res.status(404).json({ error: 'Format not found' });
    }
    next();
}

router.get('/formats', formatController.index);

router.post('/formats', formatController.create);

router.get('/formats/:formatId', validateFormatId, formatController.show);

router.put('/formats/:formatId', validateFormatId, formatController.update);

router.delete('/formats/:formatId', validateFormatId, formatController.delete);

module.exports = router;
