FROM denoland/deno:latest as base

EXPOSE 50000-55000

WORKDIR /
COPY . ./

RUN deno task compile:linux

CMD ["./build/server_linux"]