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

To run the unit tests, use jest (also available in watch mode)

```
yarn test
yarn test --watch
```

To run the Redcap importer, you first need to create and activate a virtual environment because python runs into dependency conflicts quite easily.

```
cd redcap
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=server
flask run
```

Of course, you can also install dependencies with npm (then the start script is npm run dev). To install yarn, run `npm install -g yarn`, which you might need superuser-rights for.

## Production

When deploying to production, cd into the _momenTUM-json-maker_ directory (clone it first if you don't have it in your userspace), then run `git pull && docker compose up -d --build` which will automatically pull the latest changes from GitHub, build the project for production, and start the docker containers. You can then access the project at https://tuspl22-momentum.srv.mwn.de/. The API is running on https://tuspl22-momentum.srv.mwn.de/api/.
