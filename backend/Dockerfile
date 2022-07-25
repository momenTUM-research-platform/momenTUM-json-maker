FROM rust:1.62.1

WORKDIR /usr/src/backend
COPY . .

RUN cargo install --path .
EXPOSE 8000

CMD ["backend"]