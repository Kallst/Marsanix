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
        summary: 'Crear un equipo',
        tags: ['Teams'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'creatorUserId'],
                properties: {
                  name: { type: 'string', example: 'Los Halcones' },
                  creatorUserId: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Equipo creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } },
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
        summary: 'Agregar un integrante al equipo',
        tags: ['Teams'],
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
          404: { description: 'Equipo no encontrado' },
          409: { description: 'Jugador ya en un equipo, o límite de integrantes alcanzado' },
        },
      },
    },

    '/api/teams/{teamId}/members/{userId}': {
      delete: {
        summary: 'Quitar un integrante del equipo',
        tags: ['Teams'],
        parameters: [
          { name: 'teamId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Integrante removido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } },
          404: { description: 'Equipo no encontrado' },
        },
      },
    },

    '/api/users/{userId}/teams': {
      get: {
        summary: 'Listar los equipos de un usuario',
        tags: ['Teams'],
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
        summary: 'Crear una plantilla de videojuego',
        tags: ['Games'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'teamSize'],
                properties: {
                  name: { type: 'string', example: 'League of Legends' },
                  teamSize: { type: 'integer', example: 5 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Plantilla creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/GameTemplate' } } } },
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
    },
  },

  components: {
    schemas: {
      Team: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          memberIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
        },
      },
      GameTemplate: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          teamSize: { type: 'integer' },
        },
      },
    },
  },
};