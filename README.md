# appium-boost-plugin

An appium plugin to interact with Boost robot

<img src="./docs/boost.gif" width="1024" />

## Requirements

* Boost robot
* Node 16.x

## Development

### Installing dependencies

```sh {name=install-deps}
npm ci
```

### Playground

A quick playground to interact with Boost robot

```sh {name=playground}
npm run playground:start
```

⚠ Make sure Bluetooth is ON in your laptop

### Testing

```sh {name=unit:test}
npm test
```

### Lint

```sh {name=lint}
npm run lint
```

### open-source

* Using [nathankellenicki/node-poweredup](https://github.com/nathankellenicki/node-poweredup) for robot interactions
