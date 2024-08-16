FROM debian:latest

WORKDIR /app

# Install curl and jq
RUN apt-get update \
    && apt-get install -y curl jq unzip

COPY ./downloader.sh /downloader.sh

RUN chmod 777 /downloader.sh
RUN ls -l /
CMD /downloader.sh