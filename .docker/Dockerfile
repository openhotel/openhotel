
FROM debian:latest

WORKDIR /app

# Install curl and jq
RUN apt-get update \
    && apt-get install -y curl jq unzip

RUN curl -k https://gist.githubusercontent.com/pagoru/ef5bcbda0d4f8f6145ee33d074e9ec77/raw/21913ebee2ec1546eef91c7924dbb8716140ff7d/openhotel-downloader -o /downloader.sh
# COPY ./downloader.sh /downloader.sh

RUN chmod 777 /downloader.sh
RUN ls -l /
CMD /downloader.sh