[![Build Status](https://travis-ci.org/telemark/micro-logs-main.svg?branch=master)](https://travis-ci.org/telemark/micro-logs-main)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/telemark/micro-logs-main.svg)](https://greenkeeper.io/)

# micro-logs-main

Main logs

## API

All API calls needs an Authorization header with valid jwt

```bash
$ curl -v -H "Authorization: Bearer <INSERT TOKEN>" https://logs.service.io/logs/latest
```

### ```PUT /loqs```

Add a new log

### ```GET /loqs/latest```

Get a list of the 40 latest entries

### ```GET /loqs/latest/:limit```

Get a list of the latest entries limited to the number supplied

### ```GET /loqs/:id```

Get a spesific log

### ```POST /logs/search```

Search logs

### ```POST /loqs/:id/status```

Update a logs list of statuses

### ```POST /loqs/:id/resultat```

Sets content of resultat for log

### ```GET /queue/next```

Get next log from queue

```bash
$ curl -v -H "Authorization: Bearer <INSERT TOKEN>" https://logs.service.io/queue/next
```

### ```DELETE /queue/:id```

Deletes log from queue

## Deployment - ZEIT/Now

Change content of [production.env](production.env) and [rules.json](rules.json) to match your environment.

Change content of now:alias in [package.json](package.json) to match your domains.

Deploy service.

```bash
$ npm run now-deploy
```

Deploy rules

```bash
$ now alias <your main logs domain> -r rules.json
```

## License

[MIT](LICENSE)

![Robohash image of micro-logs-main](https://robots.kebabstudios.party/micro-logs-main.png "Robohash image of micro-logs-main")
