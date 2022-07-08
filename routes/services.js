const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync')
const Service = require('../models/service');
const {isLoggedIn,isAuthor, validateService} = require('../middleware');
const services = require('../controllers/services');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(wrapAsync(services.index))
    .post(isLoggedIn, upload.array('image'), validateService, wrapAsync(services.createService))

router.get('/new', isLoggedIn, services.renderNewForm)

router.route('/:id')
    .get( wrapAsync(services.serviceDetail))
    .put( isLoggedIn,isAuthor, upload.array('image'), validateService, wrapAsync(services.updateService))
    .delete(isAuthor, wrapAsync(services.deleteService))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(services.renderEditForm))

module.exports = router