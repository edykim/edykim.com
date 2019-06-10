# Relay Quick Start Guide

Note from [Relay doc](https://facebook.github.io/relay/docs/en/quick-start-guide.html).

## Install

```sh
npx create-react-app hello-relay-world
yarn add react-relay
yarn add --dev babel-plugin-relay graphql
```

```js
// .babelrc
{
  "plugins": [
    "relay"
  ]
}
```

```sh
yarn add --dev relay-compiler
```

```js
// add in package.json
"scripts": {
  "relay": "relay-compiler --src ./src --schema ./schema.graphql --extensions js jsx"
}
```

```js
// if you need to,
require('core-js/es6/map');
require('core-js/es6/set');
require('core-js/es6/promise');
require('core-js/es6/object');

require('./myRelayApplication');
```

## Setup

```graphql
# From schema.graphql
# https://github.com/relayjs/relay-examples/blob/master/todo/data/schema.graphql

type Query {
  viewer: User

  # Fetches an object given its ID
  node(
    # The ID of an object
    id: ID!
  ): Node
}
```

## Relay Envrionment

Config Relay via Relay Environment. It bundles configuration, cache storage, network-handling, etc.

```js
import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

function fetchQuery(
  operation,
  variables,
) {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),  
});

export default environment;
```

Store and Network Layer are minimal requirements.