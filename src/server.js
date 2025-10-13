require('dotenv').config();
const Hapi = require('@hapi/hapi');

const notes = require('./api/notes');
const { NotesService } = require('./services/postgres/NotesService');
const { NotesValidator } = require('./validator/notes');

const users = require('./api/users');
const { UserService } = require('./services/postgres/UserService');
const { UserValidator } = require('./validator/users');

const init = async () => {
  const notesServices = new NotesService();
  const usersServices = new UserService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        services: notesServices,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        services: usersServices,
        validator: UserValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
