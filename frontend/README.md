# momenTUM JSON Maker

## Testing

### Unit tests with vitest

#### 1. Run
        yarn vitest

### End-to-End testing with playwrite

#### 1. Run
        yarn ptest

### End-to-End testing with cypress

#### 1. Run
        yarn ci

### Check it is in production or development mode
    docker exec <container-name> printenv NODE_ENV

### Check it to production or development mode
    docker run -e NODE_ENV=development <image-name>
