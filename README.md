# MomenTUM survey generator

## Development

## Development

To run automatically, install Docker and run:

```
docker network create caddy
docker compose -f docker-compose.local.yml  up --build

```


To run manually, install dependencies and run:

```
cd frontend
yarn
yarn dev
```

Rust API

Install Rust: https://www.rust-lang.org/learn/get-started

Development

```
cd api
cargo watch -x run -i keys.json
```

Production

```
cd api
cargo run --release
```

```

Of course, you can also install dependencies with npm (then the start script is npm run dev). To install yarn, run `npm install -g yarn`, which you might need superuser-rights for.

## Production

When deploying to production, cd into the _momenTUM-json-maker_ directory (clone it first if you don't have it in your userspace), then run `git pull && docker compose up -d --build` which will automatically pull the latest changes from GitHub, build the project for production, and start the docker containers. You can then access the project at https://tuspl22-momentum.srv.mwn.de/. The API is running on https://tuspl22-momentum.srv.mwn.de/api/v1.
```
