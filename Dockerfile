ARG HOME=/usr/src/app

FROM node:lts-alpine as base
ARG HOME
USER node
WORKDIR $HOME

COPY ["src/package.json", "src/yarn.lock", "$HOME/"]
RUN yarn install --prod && yarn cache clean

COPY ["./src", "$HOME/"]

FROM base as test
ENV CI=true
RUN npm test

FROM base as build
RUN npm run build

FROM ubuntu:latest as ssl
RUN apt-get update && apt-get install -y openssl && apt-get clean
RUN  openssl req -x509 -nodes -days 31 -newkey rsa:4096 \
     -keyout /etc/ssl/private/server.key  \
     -out /etc/ssl/certs/server.crt \
     -subj "/C=US/ST=Utah/L=Lehi/O=Your Company, Inc./OU=IT/CN=local.dev"

FROM nginx:1.22-alpine
ARG HOME
WORKDIR /usr/share/nginx/html
COPY --from=build "$HOME/build" .
COPY --from=ssl /etc/ssl/private/server.key /etc/ssl/certs/server.crt  /etc/nginx/keys/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
