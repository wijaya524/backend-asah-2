/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthHandler = this.postAuthHandler.bind(this);
    this.puthAuthHandler = this.puthAuthHandler.bind(this);
    this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
  }

  async postAuthHandler(request, h) {
    this._validator.validatePostAuthPayload(request.payload);

    const { username, password } = request.payload;

    const id = await this._usersService.verifyUserCredentials(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhsil',
      data: {
        accessToken,
        refreshToken,
      },
    });

    response.code(201);
    return response;
  }

  async puthAuthHandler(request) {
    this._validator.validatePutAuthPayload(request.payload);

    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access token berhasil',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthHandler(request) {
    this._validator.validateDeleteAuthPayload(request.payload);

    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      // eslint-disable-next-line indent
        message: 'Refresh token berhasil dihapus',
    // eslint-disable-next-line semi
    }
  }
}

module.exports = AuthenticationsHandler;
