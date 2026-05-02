const Contact = require('../models/Contact');
const catchAsync = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * @desc    Submit a contact form inquiry
 * @route   POST /api/v1/contact
 * @access  Public
 */
const submitContactForm = catchAsync(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  logger.info(`New contact inquiry received from ${email}`);

  res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully. We will get back to you soon!',
    data: contact,
  });
});

module.exports = {
  submitContactForm,
};
