[![CI](https://github.com/zaini/proto/actions/workflows/main.yml/badge.svg)](https://github.com/zaini/proto/actions/workflows/main.yml)

# proto

Proto is a web application to enable students to practice programming and data structures & algorithms as well as enabling teachers to track the progress of students, identify areas of struggle and create their own problems.

https://azaini.notion.site/Project-Notes-ef726b5090584db8b0f07925b3b01140

## Features

## Requirements

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

Information about getting a GitHub client ID and secret can be found [here.](https://docs.github.com/en/rest/guides/basics-of-authentication)

#### Main

## Testing

To run the backend tests:

1. Go to the backend directory.

2. Start a test instance of the server with `yarn run test:dev`

3. Run the tests with `yarn run test`

To run the frontend tests:

1. Go to the backend directory.

2. ...

## Other

This was part of a dissertation project at King's College London supervised by Dr Christopher Hampson
