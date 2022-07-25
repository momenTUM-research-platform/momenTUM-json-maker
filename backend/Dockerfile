FROM rust:1.62.1

WORKDIR /usr/src/backend
COPY . .

RUN cargo install --path .
EXPOSE 8000

RUN git config --global user.email "backend@server.de"
RUN git config --global user.name "backend"

CMD ["backend"]