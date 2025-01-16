FROM node:22
COPY --from=denoland/deno:bin-2.1.5 /deno /usr/local/bin/deno

WORKDIR /openhotel

COPY package.json deno.json ./
COPY app/client/package.json app/client/yarn.lock ./app/client/
COPY app/server/deno.json ./app/server/

RUN deno task install

CMD ["deno", "task", "start"]
