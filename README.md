# Open Tourism Platform

[![Join the chat at https://gitter.im/open-tourism-platform/Lobby](https://badges.gitter.im/open-tourism-platform/Lobby.svg)](https://gitter.im/open-tourism-platform/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/foundersandcoders/open-tourism-platform.svg?branch=master)](https://travis-ci.org/foundersandcoders/open-tourism-platform)
[![Coverage Status](https://coveralls.io/repos/github/foundersandcoders/open-tourism-platform/badge.svg?branch=master)](https://coveralls.io/github/foundersandcoders/open-tourism-platform?branch=master)

**Release History:**

| Version Number  | Release Date |
| ------------- | ------------- |
|  0.0.0 | Summer 2017 |
|  1.0.0  | 07/11/2017  |

If you want to get involved, check out the [contributing file](./CONTRIBUTING.md).

See the API docs [here](./docs/api.md).
See the guide for app developers using OAuth [here](./docs/oauth.md).

## What?
An open backend to help support and facilitate the creation of apps and websites aimed at developing tourism in Nazareth.

Primarily, and during initial phases, this will be an open database of places, products, services, events and reviews.

## Local install instructions

**Requirements**: MongoDB

```
git clone https://github.com/foundersandcoders/open-tourism-platform.git && cd open-tourism-platform
npm i
```

Create a `.env` file containing three variables in the root directory:
```
MONGODB_URI_DEV=mongodb://localhost/open-platform-dev
MONGODB_URI_TEST=mongodb://localhost/open-platform-test
JWT_SECRET=devEnvironmentSecret
```

Ensure mongodb is running.

**Run a dev server**

```
npm run dev
```

**Test scripts**

```bash
# To run the tests:
npm test

# To run the istanbul coverage:
npm run coverage
```
