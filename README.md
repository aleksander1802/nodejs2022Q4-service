# Home Library Service Part 2

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/aleksander1802/nodejs2023Q2-service/tree/develop_part2
```

## Switch to the develop branch

```
git checkout develop_part2
```

## Installing NPM modules

```
npm install
```

## Running application in detached mode (highly recommended)

```
docker-compose up -d
```

## Or running application in attached mode (in this case, you will have to run commands in another terminal)

```
docker-compose up
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal (in attached mode) and enter:

```
npm run test
```

## Checking for vulnerabilities (in some cases, you may need to start VPN)

After application running open new terminal (in attached mode) and enter:

```
npm run start:scout
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
