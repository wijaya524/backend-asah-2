const { NotesPayloadSchema } = require('./schema');

const NotesValidator = {
  validationNotes: (payload) => {
    const validationResult = NotesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  }
};

module.exports = { NotesValidator };