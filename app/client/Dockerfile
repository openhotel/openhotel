FROM node:21-alpine3.19 AS build
ARG CACHEBUST=0
WORKDIR /
COPY . ./
RUN yarn install --frozen-lockfile
COPY . .
RUN ls -l
RUN yarn build

FROM nginx:alpine
ARG CACHEBUST=0
COPY --from=build /build ./build
RUN ls -l
COPY ./nginx.conf /etc/nginx/nginx.conf
