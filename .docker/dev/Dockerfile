ARG DENO_VERSION=2.9.7
FROM denoland/deno:bin-${DENO_VERSION} AS deno

FROM node:24
COPY --from=deno /deno /usr/local/bin/deno
RUN corepack enable
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
