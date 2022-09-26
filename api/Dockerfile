FROM rust:1.63.0

WORKDIR /usr/src/api
COPY . .

ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000

RUN cargo install --path .
EXPOSE 8000

CMD ["api"]