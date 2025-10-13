const { NotesPayloadSchema } = require('./schema');
const InvarianError = require('../../exceptions/InvariantError');

const NotesValidator = {
  validationNotes: (payload) => {
    const validationResult = NotesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvarianError(validationResult.error.message);
    }
  },
};

module.exports = { NotesValidator };
