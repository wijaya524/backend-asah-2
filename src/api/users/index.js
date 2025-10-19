/* eslint-disable linebreak-style */
const UsersHandler = require('./handler');
const routes = require('./route');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { services, validator }) => {
    const userHandler = new UsersHandler(services, validator);

    server.route(routes(userHandler));
  },

};
