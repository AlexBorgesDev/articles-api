# Articles - API

Articles is a REST API built with Nest. With the purpose of maintaining the entire ecosystem of a blog. Providing CRUD functionality for: users, post and images. With authentication being done using jwt token.

## Installation

```bash
npm install
```

## Environment Variables

> All the variables that this project requests can be found in the [`.env.example`](./.env.example) file.

To run this project, you will need to add the following environment variables to your .env

* `JWT_SECRET`

* `DATABASE_URL`

if using docker using the project's docker-compose files, the following variables must also be informed:

* `DATABASE_PORT`

* `DATABASE_USER`

* `DATABASE_PASS`

* `DATABASE_NAME`

## Running the app

After installing the dependencies, run one of the following commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

or run in development mode with docker, running the following command in the project root:

```bash
docker compose -f "docker-compose.yml" up -d --build
```

## Running the Tests

> :warning: Before running the e2e tests make sure the environment variables point to a test database

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation

See the [documentation here](https://app.swaggerhub.com/apis-docs/AlexBorgesDev/Articles-API).

Or if the application is running, access the `/docs` route.

## License

[MIT](./LICENSE)
