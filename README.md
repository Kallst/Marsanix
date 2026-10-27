# Marsanix Esports

Plataforma web para la organización y gestión de torneos públicos de videojuegos. Centraliza usuarios, equipos, torneos, inscripciones, enfrentamientos y resultados, con el objetivo de reducir el trabajo manual de los organizadores.

Proyecto académico de Ingeniería de Software II. El alcance del MVP es: torneos públicos, formato de eliminación simple y un único videojuego soportado (**Rocket League**), con una arquitectura que permite incorporar otros juegos después.

## Estado del proyecto

Versión actual: **v0.2.x** (solo backend).

| Área | Estado |
|---|---|
| Estructura base del backend y arquitectura hexagonal | Hecho |
| Equipos: creación, integrantes y capitán | Hecho |
| Plantillas de videojuego con reglas (Rocket League) | Hecho |
| Usuarios: registro, login (JWT) y perfil | Hecho |
| Documentación Swagger/OpenAPI | Hecho |
| Torneos, inscripciones y ciclo de vida | Pendiente (ACT-016 a ACT-020, ACT-026) |
| Bracket y enfrentamientos | Pendiente (ACT-021, ACT-022) |
| Integración con la API del videojuego y resultados | Pendiente (ACT-023 a ACT-025) |
| Estadísticas básicas | Pendiente (ACT-027) |
| Frontend Angular | Pendiente (ACT-028, ACT-029) |
| Pruebas automáticas, documentación final y despliegue | Pendiente (ACT-030) |

Las carpetas `tournaments`, `matches` y `statistics` existen como estructura, pero todavía no tienen funcionalidad.

## Tecnologías

- Node.js, Express 5 y TypeScript
- PostgreSQL (acceso con el paquete `pg`)
- JWT (`jsonwebtoken`) y bcrypt para autenticación
- Swagger UI para la documentación de la API
- `tsx` para desarrollo
- Angular para el frontend (pendiente)

## Requisitos previos

| Herramienta | Versión recomendada | Verificar con |
|---|---|---|
| Node.js | 20 o superior (probado con 24) | `node -v` |
| npm | Incluido con Node.js | `npm -v` |
| PostgreSQL | 13 o superior (probado con 18) | `psql --version` |
| Git | Cualquiera reciente | `git --version` |

PostgreSQL 13 o superior es necesario porque el script de seed usa `gen_random_uuid()`.

## Estructura del repositorio

```
Marsanix - Ingeniería de software II/
├── README.md
├── .gitignore
└── Backend/
    ├── package.json
    ├── tsconfig.json
    ├── example.env          # plantilla de variables de entorno
    ├── .env                 # tu configuración local (no se sube al repositorio)
    └── src/
        ├── server.ts        # arranque del servidor
        ├── app.ts           # composition root: conecta repositorios, casos de uso y controladores
        ├── db.ts            # conexión a PostgreSQL
        ├── openapi.ts       # documentación Swagger
        └── context/
            ├── users/       # implementado
            ├── teams/       # implementado
            ├── games/       # implementado
            ├── tournaments/ # pendiente
            ├── matches/     # pendiente
            └── statistics/  # pendiente
```

Cada contexto sigue la arquitectura hexagonal con tres capas:

- `domain/`: entidades, objetos de valor, excepciones e interfaces de repositorio. No depende de ninguna tecnología externa.
- `application/`: casos de uso y DTOs.
- `infrastructure/`: controladores Express, rutas y repositorios PostgreSQL.

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd "Marsanix - Ingeniería de software II"
git checkout develop
```

### 2. Instalar dependencias

Todos los comandos de `npm` se ejecutan **dentro de la carpeta `Backend`**:

```bash
cd Backend
npm install
```

Esto instala todas las dependencias, incluidas `bcrypt` y `jsonwebtoken`, junto con sus tipos de TypeScript.

> **Windows (PowerShell):** si aparece el error "la ejecución de scripts está deshabilitada", ejecuta una vez
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
> o usa `npm.cmd` en lugar de `npm`.

### 3. Configurar las variables de entorno

Copia la plantilla y complétala:

```bash
# Windows (cmd o PowerShell)
copy example.env .env

# Linux / macOS
cp example.env .env
```

El archivo `.env` debe quedar en la carpeta `Backend` (al lado de `package.json`) con este contenido:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marsanix_esports
DB_USER=postgres
DB_PASSWORD=tu_contraseña_de_postgres
JWT_SECRET=un_secreto_largo_y_aleatorio
```

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PORT` | No | Puerto del servidor (por defecto `3000`) |
| `DB_HOST` | No | Host de PostgreSQL (por defecto `localhost`) |
| `DB_PORT` | No | Puerto de PostgreSQL (por defecto `5432`) |
| `DB_NAME` | No | Nombre de la base de datos (por defecto `marsanix_esports`) |
| `DB_USER` | No | Usuario de PostgreSQL (por defecto `postgres`) |
| `DB_PASSWORD` | Sí | Contraseña de ese usuario |
| `JWT_SECRET` | **Sí** | Secreto para firmar los tokens. Sin él, el servidor no arranca |

Para generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Nunca subas el archivo `.env` al repositorio. Si cambias `JWT_SECRET`, los tokens emitidos antes dejan de ser válidos y hay que iniciar sesión de nuevo.

### 4. Iniciar PostgreSQL

El servicio debe estar corriendo. En Windows puedes comprobarlo con:

```powershell
Get-Service *postgres*
```

Si aparece `Stopped`, inícialo desde `services.msc` o, con PowerShell como administrador, con `Start-Service <nombre-del-servicio>` (por ejemplo `postgresql-x64-18`).

### 5. Crear la base de datos

```bash
psql -U postgres -c "CREATE DATABASE marsanix_esports;"
```

Si `psql` no está en tu `PATH`, usa la ruta completa (por ejemplo `"C:\Program Files\PostgreSQL\18\bin\psql.exe"`) o crea la base desde pgAdmin, DBeaver o la extensión SQLTools de VS Code.

### 6. Crear las tablas

Conéctate a la base `marsanix_esports` y ejecuta este script completo. Es la estructura final para una base **nueva**:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  captain_id UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE team_members (
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE game_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  team_size INTEGER NOT NULL CHECK (team_size > 0),
  max_members INTEGER NOT NULL,
  rules JSONB NOT NULL,
  CHECK (max_members >= team_size)
);
```

### 7. Cargar la plantilla de Rocket League

El sistema soporta un único videojuego en esta versión. Este script lo registra y se puede ejecutar varias veces sin duplicar datos:

```sql
INSERT INTO game_templates (id, name, team_size, max_members, rules)
VALUES (
  gen_random_uuid(),
  'Rocket League',
  3,
  4,
  '{"allowedSeriesLengths":[1,3,5,7],"supportedPlatforms":["steam","epic","xbox","playstation","switch"],"resultProvider":"ballchasing"}'::jsonb
)
ON CONFLICT (name) DO NOTHING;
```

### 8. Actualizar una base de datos existente (solo si ya la tenías)

Si creaste la base con una versión anterior, **no** vuelvas a crear las tablas. Aplica solo lo que te falte, en este orden.

**Capitán de equipo (ACT-014):**

```sql
ALTER TABLE teams ADD COLUMN captain_id UUID REFERENCES users(id);

UPDATE teams t
SET captain_id = (SELECT tm.user_id FROM team_members tm WHERE tm.team_id = t.id LIMIT 1)
WHERE captain_id IS NULL;

DELETE FROM teams WHERE captain_id IS NULL;

ALTER TABLE teams ALTER COLUMN captain_id SET NOT NULL;
```

El `DELETE` elimina los equipos que no tienen ningún integrante, porque no es posible asignarles un capitán.

**Reglas de la plantilla de videojuego (ACT-015):**

```sql
ALTER TABLE game_templates ADD COLUMN max_members INTEGER;
ALTER TABLE game_templates ADD COLUMN rules JSONB;

UPDATE game_templates
SET max_members = team_size,
    rules = '{"allowedSeriesLengths":[1,3,5,7],"supportedPlatforms":["steam","epic","xbox","playstation","switch"],"resultProvider":"ballchasing"}'::jsonb;

ALTER TABLE game_templates ALTER COLUMN max_members SET NOT NULL;
ALTER TABLE game_templates ALTER COLUMN rules SET NOT NULL;
ALTER TABLE game_templates ADD CONSTRAINT game_templates_max_members_check CHECK (max_members >= team_size);
```

Las plantillas que ya existieran reciben las reglas de Rocket League por defecto. Si alguna es de otro juego, edítala después con `PUT /api/games/{id}`.

## Ejecutar el proyecto

Desde la carpeta `Backend`:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Modo desarrollo con recarga automática (`tsx watch`) |
| `npm run build` | Compila TypeScript a `dist/` y revisa los tipos |
| `npm start` | Ejecuta la versión compilada (`node dist/server.js`). Requiere haber corrido `npm run build` |

`npm run dev` no revisa tipos al ejecutar. Antes de hacer un commit, corre `npm run build` para detectar errores de compilación.

Al arrancar correctamente verás:

```
Servidor backend escuchando en http://localhost:3000
```

### Verificar que funciona

- Salud del servicio: <http://localhost:3000/api/health> debe responder `{"status":"ok","service":"marsanix-esports-backend"}`.
- Documentación interactiva: <http://localhost:3000/api-docs>.
- Plantillas cargadas: <http://localhost:3000/api/games> debe listar Rocket League con sus reglas. Si devuelve `[]`, falta el paso 7.

## Probar la API desde Swagger

1. En `/api-docs`, usa `POST /api/users/register` con un cuerpo como:
   ```json
   { "name": "Lola", "email": "lola@test.com", "password": "12345678" }
   ```
2. Usa `POST /api/users/login` con el mismo correo y contraseña, y copia el valor de `token`.
3. Pulsa **Authorize** (el candado) y pega **solo el token**, sin la palabra `Bearer` y sin espacios. Swagger agrega `Bearer` por su cuenta.
4. Ya puedes usar los endpoints protegidos, como `POST /api/teams` o `POST /api/games`.

Los tokens duran 24 horas. Si recibes `401`, vuelve a iniciar sesión.

## Endpoints

Todos van bajo el prefijo `/api`. Los endpoints con "Token" requieren el encabezado `Authorization: Bearer <token>`.

### Usuarios

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/users/register` | Público | Registrar un usuario |
| POST | `/users/login` | Público | Iniciar sesión y obtener el token |
| GET | `/users/:userId` | Token, solo el propio usuario | Consultar el perfil |
| PUT | `/users/:userId` | Token, solo el propio usuario | Editar el nombre del perfil |
| GET | `/users/:userId/teams` | Público | Listar los equipos de un usuario |

### Equipos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/teams` | Token | Crear un equipo (quien lo crea queda como capitán) |
| GET | `/teams/:teamId` | Público | Consultar un equipo |
| POST | `/teams/:teamId/members` | Token, capitán | Agregar un integrante |
| DELETE | `/teams/:teamId/members/:userId` | Token, capitán | Quitar un integrante |
| PUT | `/teams/:teamId/captain` | Token, capitán | Transferir la capitanía |

### Plantillas de videojuego

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/games` | Público | Listar plantillas |
| GET | `/games/:id` | Público | Consultar una plantilla |
| POST | `/games` | Token | Crear una plantilla |
| PUT | `/games/:id` | Token | Editar nombre y reglas |

Cuerpo de ejemplo para crear o editar una plantilla:

```json
{
  "name": "Rocket League",
  "teamSize": 3,
  "maxMembers": 4,
  "allowedSeriesLengths": [1, 3, 5, 7],
  "supportedPlatforms": ["steam", "epic", "xbox", "playstation", "switch"],
  "resultProvider": "ballchasing"
}
```

### Códigos de respuesta

| Código | Significado |
|---|---|
| 200 / 201 | Operación exitosa / recurso creado |
| 400 | Datos inválidos |
| 401 | Token ausente, inválido o vencido |
| 403 | Sin permiso (por ejemplo, no eres el capitán) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (nombre duplicado, jugador ya en un equipo, límite alcanzado) |

## Reglas de negocio vigentes

- La contraseña debe tener al menos 8 caracteres y se guarda con bcrypt.
- El nombre del equipo debe tener entre 3 y 30 caracteres.
- Un jugador solo puede pertenecer a un equipo.
- Solo el capitán agrega o quita integrantes. El capitán no puede ser quitado sin transferir antes la capitanía.
- Reglas de una plantilla de videojuego:
  - `teamSize`: jugadores en cancha, entero mayor o igual a 1.
  - `maxMembers`: máximo de integrantes incluyendo suplentes, mayor o igual a `teamSize` y hasta 20.
  - `allowedSeriesLengths`: formatos de serie permitidos, enteros impares y sin repetir (1, 3, 5, 7...).
  - `supportedPlatforms`: valores entre `steam`, `epic`, `xbox`, `playstation` y `switch`.
  - `resultProvider`: identificador de la fuente de resultados del juego (2 a 50 caracteres: letras, números, guion o guion bajo).

### Limitaciones conocidas

- El límite de integrantes de un equipo está fijo en 5 en el código. Todavía no se lee de la plantilla del videojuego; se conectará cuando se implementen la configuración del torneo y las inscripciones.
- No existe rol de administrador: cualquier usuario autenticado puede crear o editar plantillas.
- No hay pruebas automáticas todavía.
- `resultProvider` solo se guarda y se valida; ningún componente lo usa aún. La fuente de resultados de Rocket League está pendiente de validar.

## Flujo de trabajo con Git (Gitflow)

| Rama | Sale de | Entra a | Uso |
|---|---|---|---|
| `main` | — | — | Código estable, solo recibe `release/*` |
| `develop` | — | — | Integración del trabajo en curso |
| `feature/ACT-0XX-nombre` | `develop` | `develop` | Funcionalidades nuevas |
| `bugfix/ACT-0XX-nombre` | `develop` | `develop` | Corrección de errores |
| `release/vX.Y.Z` | `develop` | `main` y `develop` | Cierre de versión, con tag en `main` |

Reglas:

- Todo cambio entra por pull request. Nada se sube directamente a `main` ni a `develop`.
- Los commits y los nombres de rama se escriben en inglés, con el formato `feat: add ...` o `fix: correct ...`.
- Antes de abrir un pull request, ejecuta `npm run build` en `Backend` y comprueba que no hay errores.
- Si el cambio altera la base de datos, agrega el script de migración a este README.

## Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| `npm` falla con "no se puede cargar el archivo npm.ps1" | PowerShell bloquea scripts. Ejecuta `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| `npm error ENOENT ... package.json` | Estás en la carpeta equivocada. Entra a `Backend` antes de usar `npm` |
| `JWT_SECRET no está definido en las variables de entorno` | Falta el `.env` en `Backend` o no incluye `JWT_SECRET`. Reinicia `npm run dev` tras editarlo |
| Error de conexión a PostgreSQL (`AggregateError`, `ECONNREFUSED`) | El servicio está detenido o los datos del `.env` no coinciden. Inícialo y prueba `127.0.0.1` en lugar de `localhost` |
| `password authentication failed` | `DB_USER` o `DB_PASSWORD` incorrectos |
| `relation "..." does not exist` o `column "..." does not exist` | Falta crear las tablas o aplicar las migraciones del paso 8 |
| `401` con el mensaje "Token inválido o expirado" | Token vencido, `JWT_SECRET` cambiado, o pegaste `Bearer ` en el candado de Swagger. Inicia sesión de nuevo y pega solo el token |
| `EADDRINUSE` | El puerto ya está en uso. Cierra el otro proceso o cambia `PORT` en `.env` |
| `bcrypt` falla al cargar su módulo nativo | Ejecuta `npm approve-scripts bcrypt` (o `npm rebuild bcrypt`) y vuelve a intentar |

## Equipo

- Santiago Castro Marlés
- Mariana Alzate Barbosa