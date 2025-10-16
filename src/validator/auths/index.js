/* eslint-disable linebreak-style */
const InvariantError = require('../../exceptions/InvariantError');
const { PostAuthsPayloadSchema, PutAuthPayloadSchema, DeleteAuthPayloadSchema } = require('./schema');

const AuthValidator = {
  validatePostAuthPayload: (payload) => {
    const validationResult = PostAuthsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthPayload: (payload) => {
    const validationResult = PutAuthPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthPayload: (payload) => {
    const validationResult = DeleteAuthPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
// eslint-disable-next-line linebreak-style
// eslint-disable-next-line linebreak-style

module.exports = AuthValidator;
