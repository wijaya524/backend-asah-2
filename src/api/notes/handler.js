const ClientError = require('../../exceptions/ClientError');

class NotesHandler {
  constructor(service, validator) {
    // eslint-disable-next-line no-underscore-dangle
    this._service = service;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNoteHandler = this.getNoteHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNotedHandler = this.putNotedHandler.bind(this);
    this.deletedNotedHandler = this.deletedNotedHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      this._validator.validationNotes(request.payload);
      const { title = 'untitled', body, tags } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      // eslint-disable-next-line no-underscore-dangle
      const NoteId = await this._service.addNote({
        title, body, tags, owner: credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          NoteId,
        },

      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Maaf terjadi kesalahan pada server',
      });

      response.code(500);
      return response;
    }
  }

  async getNoteHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    // eslint-disable-next-line no-underscore-dangle
    const notes = await this._service.getNote(credentialId);
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      // eslint-disable-next-line no-underscore-dangle
      await this._service.verifyNoteOwner(id, credentialId);
      // eslint-disable-next-line no-underscore-dangle
      const note = await this._service.getNoteById(id);

      return {
        status: 'success',
        data: {
          note,
        },
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });

      response.code(404);
      return response;
    }
  }

  async putNotedHandler(request, h) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      this._validator.validationNotes(request.payload);
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      // eslint-disable-next-line no-underscore-dangle
      await this._service.verifyNoteOwner(id, credentialId);
      // eslint-disable-next-line no-underscore-dangle
      await this._service.editedNotes(id, request.payload);

      return {
        status: 'success',
        message: 'Berhasil memperbaruhi catatan',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbaruhi catatan',
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Server error',
      });

      response.code(500);
      return response;
    }
  }

  async deletedNotedHandler(request, h) {
    try {
      const { id } = request.params;

      const { id: credentialId } = request.auth.credentials;
      // eslint-disable-next-line no-underscore-dangle
      await this._service.verifyNoteOwner(id, credentialId);

      // eslint-disable-next-line no-underscore-dangle
      await this._service.deletedById(id);

      return {
        status: 'success',
        message: 'Berhasil menghapus catatan',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = NotesHandler;
