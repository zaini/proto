[![CI](https://github.com/zaini/proto/actions/workflows/main.yml/badge.svg)](https://github.com/zaini/proto/actions/workflows/main.yml)

# Proto

Proto is a full-stack web application for creating, solving, and automatically assessing programming problems and submissions. It includes features to build classrooms, invite users, set assignments, and give feedback. Developers can utilise the modular backend in various contexts such as university assignments, coding challenges, hackathons, and employability examinations. The accompanying frontend aims to showcase how this backend can be implemented with a user-friendly web application.

## Requirements

This project requires the following:

- Node
- npm
- yarn
- PostgreSQL
- Docker/Docker Compose

## Setup + Installation

### Frontend

#### Environment

Set the following envrionment variables for the frontend. Adjust them as needed for your use case.

```
NODE_PATH=./src
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_GRAPHQL_URL=http://localhost:5000/graphql
REACT_APP_GITHUB_AUTH_URL=http://localhost:5000/auth/github
REACT_APP_JWT_TOKEN_SECRET=same_as_backend_JWT_TOKEN_SECRET
```

#### Main

1. In the frontend directory, run `yarn install` to install all the required packages.

2. Run `yarn start` to start the application. It should be accessible at `http://localhost:3000/`

### Backend

#### Judge0

[GitHub for Judge0](https://github.com/judge0/judge0)

This project uses `judge0-v1.13.0`. It is included in the backend directory.

It requires [`Docker`](https://docs.docker.com/) and [`Docker Compose`.](https://docs.docker.com/compose/) More information about the deployment procedure can be found [here.](https://github.com/judge0/judge0/blob/master/CHANGELOG.md#deployment-procedure)

#### Environment

Set the following envrionment variables for the backend. Adjust them as needed for your use case.

```
DATABASE_URL="postgresql://username:password@localhost:5432/proto"
JWT_TOKEN_SECRET=same_as_frontend_JWT_TOKEN_SECRET
CLIENT_ID_GITHUB=GH_CLIENT_ID
CLIENT_SECRET_GITHUB=GH_SECRET_ID
REDIRECT_URI_GITHUB=http://localhost:3000/accounts/login
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=some_secret_session_password
JUDGE_API_URL=http://localhost:2358
NODE_ENV=development
```

Information about getting a GitHub client ID and secret can be found [here.](https://docs.github.com/en/rest/guides/basics-of-authentication) Set the Homepage URL to `http://localhost:5000/` and the Authorisation callback URL to `http://localhost:5000/auth/github/callback` for this to work locally. Adjust according to your deployment.

#### Main

1. In the backend directory, run `yarn install` to install all the required packages.

2. Run `yarn run judge` to start Judge0.

3. Run `yarn run test:db:setup` followed by `yarn run test:db:seed` to set up the database.

4. Run `yarn run dev` to start the backend. It should be accessible at `http://localhost:5000/`. You can open Apollo Studio Explorer at `http://localhost:5000/graphql`.

## Testing

To run the backend tests:

1. Go to the backend directory.

2. Start a test instance of the server with `yarn run test:dev`

3. Run the tests with `yarn run test`

To run the frontend tests:

1. Go to the frontend directory and run `yarn test`. Press `a` to run all tests.

## Other

This is part of a BSc dissertation project at King's College London supervised by Dr Christopher Hampson.
