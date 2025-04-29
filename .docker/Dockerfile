FROM debian:latest

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    jq \
    unzip \
    libglib2.0-0 \
    libnss3 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2  \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2

COPY ./downloader.sh /downloader.sh

RUN chmod 777 /downloader.sh
RUN ls -l /
CMD /downloader.sh