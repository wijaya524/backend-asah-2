require('dotenv').config();
const Hapi = require('@hapi/hapi');

const { NotesService } = require('./services/postgres/NotesService');
const notes = require('./api/notes');
const { NotesValidator } = require('./validator/notes');

const init = async () => {
  const notesServices = new NotesService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      services: notesServices,
      validator: NotesValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
