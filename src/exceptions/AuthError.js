const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
  // eslint-disable-next-line constructor-super
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;