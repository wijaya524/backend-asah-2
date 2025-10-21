/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const notes = require('./api/notes');
const { NotesService } = require('./services/postgres/NotesService');
const { NotesValidator } = require('./validator/notes');

const users = require('./api/users');
const { UserService } = require('./services/postgres/UserService');
const { UserValidator } = require('./validator/users');

const authentications = require('./api/authentications');
const { AuthService } = require('./services/postgres/AuthenticationService');
const AuthValidator = require('./validator/auths');
const TokenManager = require('./tokenizer/TokenManager');

const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationService');
const CollaborationsValidator = require('./validator/collaborations');

const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitMQ/ProducerService');
const ExportsValidator = require('./validator/exports');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesServices = new NotesService(collaborationsService);
  const usersServices = new UserService();
  const authenticationsService = new AuthService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: { origin: ['*'] },
    },
  });

  // ✅ Registrasi plugin JWT DULU
  await server.register(Jwt);

  // ✅ Baru definisikan strategi autentikasi
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService: usersServices,
        tokenManager: TokenManager,
        validator: AuthValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesServices,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`✅ Server berjalan pada ${server.info.uri}`);
};

init();
