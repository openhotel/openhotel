
FROM debian:latest

WORKDIR /app

# Install curl and jq
RUN apt-get update \
    && apt-get install -y curl jq

RUN curl -k https://gist.githubusercontent.com/pagoru/e873005630c72670f011054a467e5bb3/raw/df4267eaf31611f8675adddace3180118f73a849/openhotel-auth-downloader -o /downloader.sh
# COPY ./downloader.sh /downloader.sh

RUN chmod 777 /downloader.sh
RUN ls -l /
CMD /downloader.sh