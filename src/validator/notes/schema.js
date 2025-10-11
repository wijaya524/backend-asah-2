const Joi = require('joi');

const NotesPayloadSchema = Joi.object({
  // eslint-disable-next-line linebreak-style
  title: Joi.string().required(),
  body: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
});

module.exports = { NotesPayloadSchema };