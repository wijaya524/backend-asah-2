/* eslint-disable linebreak-style */
const InvariantError = require('../../exceptions/InvariantError');
const { PostAuthsPayloadSchema, PutAuthPayloadSchema, DeleteAuthPayloadSchema } = require('./schema');

const AuthValidator = {
  ValidatePostAuthPayload: (payload) => {
    const validationResult = PostAuthsPayloadSchema(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  ValidatePutAuthPayload: (payload) => {
    const validationResult = PutAuthPayloadSchema(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  ValidateDeleteAuthPayload: (payload) => {
    const validationResult = DeleteAuthPayloadSchema(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
// eslint-disable-next-line linebreak-style
// eslint-disable-next-line linebreak-style

module.exports = AuthValidator;
