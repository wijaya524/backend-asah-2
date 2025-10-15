/* eslint-disable linebreak-style */
// eslint-disable-next-line no-irregular-whitespace
const Joi = require('joi');

// eslint-disable-next-line no-irregular-whitespace
const CollaborationPayloadSchema = Joi.object({
  noteId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };
