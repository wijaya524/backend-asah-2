const { UserPayloadSchema } = require('./schema');
const InvarianError = require('../../exceptions/InvariantError');

const UserValidator = {
  ValidationUsers: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },
};

module.exports = { UserValidator };