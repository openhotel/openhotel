FROM denoland/deno:latest as base

EXPOSE 2002,50000-55000

WORKDIR ../
COPY . ./

RUN deno task compile:current

CMD ["./server"]