/* eslint-disable linebreak-style */
const NotesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Notes',
  version: '1.0.0',
  register: async (server, { services, validator }) => {
    const notesHandler = new NotesHandler(services, validator);

    return server.route(routes(notesHandler));
  },
};
