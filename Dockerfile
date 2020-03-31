FROM node:12.16.1-alpine

WORKDIR /root

COPY . .

# util-linux is for suppressing `/bin/sh: lscpu: not found` when `parcel build`.
RUN apk add build-base python3 util-linux \
    && npm run build
