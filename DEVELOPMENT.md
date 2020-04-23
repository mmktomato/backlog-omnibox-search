# How to run in local

1. Register your app in [Backlog developer's site](https://backlog.com/developer/applications/oauth2Clients) .
1. Run `cp .env.sample .env`.
1. Replace `CLIENT_ID` and `CLIENT_SECRET` in `.env`.
1. Run `npm ci` and `npm start`.

# Building a package

1. Run `cp .env.chrome.sample .env.chrome`.
1. Replace `CLIENT_ID` and `CLIENT_SECRET` in `.env.chrome`.
1. Remove `chrome.zip` if exists.
1. Run `npm run pack -- chrome [version]`. This command accepts some variables. See below.
1. The artifact is `chrome.zip`.

Note: The build process leaves a docker image named `my/backlog-omnibox-search-build`. Remove it yourself if you want.

Note: The build process edits version in some files. Commit it and Add tag if you want.

Note: Building a firefox package is not supported yet.

## `npm run pack`

You can give some environment variables to the command.

* `DOCKER_CMD` (default: `docker`)
    * You can specify `docker` command.
    * e.g. `DOCKER_CMD='sudo docker' npm run pack -- chrome 0.0.1`
* `SKIP_DOCKER_IMAGE_BUILD` (default: `0`)
    * You can skip building docker image during build process if the value is `1`.
    * e.g. `SKIP_DOCKER_IMAGE_BUILD=1 npm run pack -- chrome 0.0.1`
