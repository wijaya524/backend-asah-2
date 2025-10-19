/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
const NotFound = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(service, validator) {
    // eslint-disable-next-line no-underscore-dangle
    this._service = service;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;

    this.postUsersHandler = this.postUsersHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  async postUsersHandler(request, h) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      this._validator.ValidationUsers(request.payload);

      const { username, password, fullname } = request.payload;

      // eslint-disable-next-line no-underscore-dangle
      const userId = await this._service.AddUser({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'Berhasil membuat user',
        data: {
          userId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      console.error(error);
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
        message: 'Server error',
      });

      response.code(500);
      return response;
    }
  }

  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;

      // eslint-disable-next-line no-underscore-dangle
      const user = await this._service.getUserById(id);

      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      if (error instanceof NotFound) {
        const response = h.response({
          status: 'fail',
          message: error.message,
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

  async getUsersByUsernameHandler(request) {
    const { username = '' } = request.query;
    const users = await this._service.getUsersByUsername(username);
    return {
      status: 'success',
      data: {
        users,
      },
    };
  }
}

module.exports = UsersHandler;
