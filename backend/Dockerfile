FROM rust:1.62.1

WORKDIR /usr/src/backend
COPY . .

RUN cargo install --path .

CMD ["backend"]