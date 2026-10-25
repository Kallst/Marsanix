export const openapiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Marsanix Esports API',
    version: '1.0.0',
    description: 'API para la organización y gestión de torneos de videojuegos.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/api/health': {
      get: {
        summary: 'Verifica que el servidor esté activo',
        tags: ['Health'],
        responses: {
          200: {
            description: 'Servicio activo',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'marsanix-esports-backend' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/teams': {
      post: {
        summary: 'Crear un equipo (quien lo crea queda como capitán)',
        tags: ['Teams'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Los Halcones' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Equipo creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } },
          400: { description: 'Nombre del equipo inválido' },
          401: { description: 'Token ausente, inválido o vencido' },
          409: { description: 'El jugador ya pertenece a un equipo' },
        },
      },
    },

    '/api/teams/{teamId}': {
      get: {
        summary: 'Consultar un equipo por id',
        tags: ['Teams'],
        parameters: [{ name: 'teamId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Equipo encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } },
          404: { description: 'Equipo no encontrado' },
        },
      },
    },

    '/api/teams/{teamId}/members': {
      post: {
        summary: 'Agregar un integrante al equipo (solo el capitán)',
        tags: ['Teams'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'teamId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: { userId: { type: 'string', format: 'uuid' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Integrante agregado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } },
          401: { description: 'Token ausente, inválido o vencido' },
          403: { description: 'Solo el capitán del equipo puede agregar integrantes' },
          404: { description: 'Equipo no encontrado' },
          409: { description: 'Jugador ya en un equipo, o límite de integrantes alcanzado' },
        },
      },
    },

    '/api/teams/{teamId}/members/{userId}': {
      delete: {
        summary: 'Quitar un integrante del equipo (solo el capitán)',
        tags: ['Teams'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'teamId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Integrante removido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } },
          401: { description: 'Token ausente, inválido o vencido' },
          403: { description: 'Solo el capitán del equipo puede quitar integrantes' },
          404: { description: 'Equipo no encontrado' },
          409: { description: 'El capitán no puede ser quitado; primero debe transferir la capitanía' },
        },
      },
    },

    '/api/teams/{teamId}/captain': {
      put: {
        summary: 'Transferir la capitanía a otro integrante (solo el capitán actual)',
        tags: ['Teams'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'teamId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: { userId: { type: 'string', format: 'uuid', description: 'Nuevo capitán (debe ser integrante del equipo)' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Capitanía transferida', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } },
          401: { description: 'Token ausente, inválido o vencido' },
          403: { description: 'Solo el capitán del equipo puede transferir la capitanía' },
          404: { description: 'Equipo no encontrado' },
          409: { description: 'El nuevo capitán no es integrante del equipo' },
        },
      },
    },

    '/api/users/register': {
      post: {
        summary: 'Registrar un usuario',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Lola' },
                  email: { type: 'string', format: 'email', example: 'lola@test.com' },
                  password: { type: 'string', minLength: 8, example: '12345678' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuario registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          400: { description: 'Datos inválidos (nombre, correo o contraseña)' },
          409: { description: 'Ya existe un usuario con ese correo' },
        },
      },
    },

    '/api/users/login': {
      post: {
        summary: 'Iniciar sesión',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'lola@test.com' },
                  password: { type: 'string', example: '12345678' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Sesión iniciada', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResult' } } } },
          400: { description: 'Datos inválidos' },
          401: { description: 'Credenciales inválidas' },
        },
      },
    },

    '/api/users/{userId}': {
      get: {
        summary: 'Consultar el perfil de un usuario por id',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Usuario encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Token ausente, inválido o vencido' },
          403: { description: 'Solo puedes consultar tu propio perfil' },
          404: { description: 'Usuario no encontrado' },
        },
      },
      put: {
        summary: 'Editar el nombre del perfil del usuario autenticado',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 100, example: 'Lola Alzate' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Perfil actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          400: { description: 'Nombre inválido' },
          401: { description: 'Token ausente, inválido o vencido' },
          403: { description: 'Solo puedes editar tu propio perfil' },
          404: { description: 'Usuario no encontrado' },
        },
      },
    },

    '/api/users/{userId}/teams': {
      get: {
        summary: 'Listar los equipos de un usuario',
        tags: ['Users'],
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: {
            description: 'Lista de equipos',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Team' } } } },
          },
        },
      },
    },

    '/api/games': {
      post: {
        summary: 'Crear una plantilla de videojuego con sus reglas',
        tags: ['Games'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/GameTemplateInput' } } },
        },
        responses: {
          201: { description: 'Plantilla creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/GameTemplate' } } } },
          400: { description: 'Reglas inválidas' },
          401: { description: 'Token ausente, inválido o vencido' },
          409: { description: 'Ya existe una plantilla con ese nombre' },
        },
      },
      get: {
        summary: 'Listar plantillas de videojuegos',
        tags: ['Games'],
        responses: {
          200: {
            description: 'Lista de plantillas',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/GameTemplate' } } } },
          },
        },
      },
    },

    '/api/games/{id}': {
      get: {
        summary: 'Consultar una plantilla de videojuego por id',
        tags: ['Games'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Plantilla encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/GameTemplate' } } } },
          404: { description: 'Plantilla no encontrada' },
        },
      },
      put: {
        summary: 'Editar el nombre y las reglas de una plantilla de videojuego',
        tags: ['Games'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/GameTemplateInput' } } },
        },
        responses: {
          200: { description: 'Plantilla actualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/GameTemplate' } } } },
          400: { description: 'Reglas inválidas' },
          401: { description: 'Token ausente, inválido o vencido' },
          404: { description: 'Plantilla no encontrada' },
          409: { description: 'Ya existe otra plantilla con ese nombre' },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Team: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          captainId: { type: 'string', format: 'uuid' },
          memberIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
        },
      },

      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      LoginResult: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
        },
      },

      GameTemplateInput: {
        type: 'object',
        required: ['name', 'teamSize', 'maxMembers', 'allowedSeriesLengths', 'supportedPlatforms', 'resultProvider'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 50, example: 'Rocket League' },
          teamSize: { type: 'integer', minimum: 1, description: 'Jugadores en cancha por equipo', example: 3 },
          maxMembers: { type: 'integer', description: 'Máximo de integrantes de la plantilla, incluidos suplentes (>= teamSize, máx. 20)', example: 4 },
          allowedSeriesLengths: { type: 'array', items: { type: 'integer' }, description: 'Formatos de serie permitidos (mejor de N, N impar)', example: [1, 3, 5, 7] },
          supportedPlatforms: {
            type: 'array',
            items: { type: 'string', enum: ['steam', 'epic', 'xbox', 'playstation', 'switch'] },
            example: ['steam', 'epic', 'xbox', 'playstation', 'switch'],
          },
          resultProvider: { type: 'string', description: 'Identificador de la fuente de resultados del videojuego', example: 'ballchasing' },
        },
      },

      GameTemplate: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          teamSize: { type: 'integer' },
          maxMembers: { type: 'integer' },
          allowedSeriesLengths: { type: 'array', items: { type: 'integer' } },
          supportedPlatforms: { type: 'array', items: { type: 'string' } },
          resultProvider: { type: 'string' },
        },
      },
    },
  },
};