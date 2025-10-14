/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthHandler(request, h) {
    this._validator.ValidatePostAuthPayload(request.payload);

    const { username, password } = request.payload;

    const id = this._usersService.verifyUserCredentials(username, password);

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

  async puthAuthHandler(request, h) {
    this._validator.ValidatePutAuthPayload(request.payload);

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

  async deleteAuthHandler(request, h) {
    this._validator.ValidateDeleteAuthPayload(request.payload);

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
