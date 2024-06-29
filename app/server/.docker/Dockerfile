FROM denoland/deno:latest as base

EXPOSE 2002
EXPOSE 50000-55000

WORKDIR ../
COPY . ./

RUN ls -l
RUN deno task compile:current

CMD ["./server"]