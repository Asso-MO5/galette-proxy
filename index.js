'use strict';
require('dotenv').config()
const Hapi = require('@hapi/hapi');

const routes = require('./features/routes/routes');

const init = async () => {

  const server = Hapi.server({
    port: 4500,
    host: 'localhost'
  });

  // Configuration de l'authentification par token
  server.auth.scheme('token', () => {
    return {
      authenticate: async (request, h) => {
        const token = request.headers['x-api-token'] || request.headers['authorization']?.replace('Bearer ', '');

        if (!token) {
          return h.response({ error: 'Token manquant' }).code(401).takeover();
        }

        const validToken = process.env.API_TOKEN || 'your-secret-token';

        if (token !== validToken) {
          return h.response({ error: 'Token invalide' }).code(401).takeover();
        }

        return h.authenticated({ credentials: { token } });
      }
    };
  });

  server.auth.strategy('token', 'token');
  server.auth.default('token');

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();