# momenTUM JSON Maker

## Testing

### Unit tests with vitest

#### 1. Run
        yarn vitest

### End-to-End testing with playwrite

#### 0. Make sure the example study has a Unique ID

#### 1. Jumpstart the server and make sure it's running locally

#### 2. Start the frontend and host it locally
        pnpm dev

#### 3. Run
        yarn ptest

### End-to-End testing with cypress

#### 1. Run
        yarn ci

### Check it is in production or development mode
    docker exec <container-name> printenv NODE_ENV

### Check it to production or development mode
    docker run -e NODE_ENV=development <image-name>
