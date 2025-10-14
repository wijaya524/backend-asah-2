const Joi = require('joi');

const PostAuthsPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthsPayloadSchema,
  PutAuthPayloadSchema,
  DeleteAuthPayloadSchema,
};
