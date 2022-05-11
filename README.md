# MomenTUM survey generator

## Development

To run, install dependencies and run:

```
cd frontend
yarn
yarn dev
```

If you also want to run the server, you need to copy the example environment variables by running:

```
cd server
cp .env.example .env
```

Then you can start the server with

```
yarn
yarn dev
```

Of course, you can also install dependencies with npm (then the start script is npm run dev). To install yarn, run `npm install -g yarn`, which you might need superuser-rights for.

## Production

When deploying to production, cd into the _momenTUM-json-maker_ directory (clone it first if you don't have it in your userspace), then run `./update.sh` which will automatically pull the latest changes from GitHub, switch to the main branch, build the project for production, copy it to the apache web root and start the API, no input needed from your side.

```

```
