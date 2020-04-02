FROM node:12.16.1-alpine

WORKDIR /root

COPY . .

# util-linux is for suppressing `/bin/sh: lscpu: not found` when `parcel build`.
RUN apk add --no-cache build-base python3 util-linux zip \
    && rm .env \
    && npm run clean \
    && npm ci

ENTRYPOINT ["tail", "-f", "/dev/null"]
