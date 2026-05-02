const express = require('express');
const contactController = require('../../controllers/contact.controller');
const { validate } = require('../../middleware/validate');
const contactValidator = require('../../validators/contact.validator');

const router = express.Router();

router.post(
  '/',
  validate(contactValidator.submitContactForm),
  contactController.submitContactForm
);

module.exports = router;
