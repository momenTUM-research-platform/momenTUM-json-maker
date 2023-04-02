# Leveraging the pre-built Docker images with 
# cargo-chef and the Rust toolchain
# FROM lukemathwalker/cargo-chef:latest-rust-1.59.0 AS chef
# WORKDIR app

# FROM chef AS planner
# COPY . .
# RUN cargo chef prepare --recipe-path recipe.json

# FROM chef AS builder 
# COPY --from=planner /app/recipe.json recipe.json

# # Build dependencies - this is the caching Docker layer!
# RUN cargo chef cook --release --recipe-path recipe.json
# # Build application
# COPY . .
# RUN cargo doc --no-deps
# RUN cargo build --release --bin designer

# # We do not need the Rust toolchain to run the binary!
# FROM alpine:latest AS runtime
# RUN apk add curl
# WORKDIR app

# ENV ROCKET_ADDRESS=0.0.0.0
# ENV ROCKET_PORT=8000
# COPY --from=builder /app/target/release/designer /usr/local/bin
# COPY --from=builder /app/Rocket.toml /
# COPY --from=builder /app/target/doc /docs
# COPY --from=builder /app/.env /
# ENTRYPOINT ["/usr/local/bin/designer"]
FROM rust:latest

WORKDIR /usr/src/designer
COPY . .

RUN cargo install --path .

CMD ["designer"]
