/* eslint-disable linebreak-style */
const AuthenticationsHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authenticationsService, usersService, tokenManager, validator,
  }) => {
    // eslint-disable-next-line max-len
    const authenticationHandler = new AuthenticationsHandler(authenticationsService, usersService, tokenManager, validator);
    server.route(routes(authenticationHandler));
  },
};
