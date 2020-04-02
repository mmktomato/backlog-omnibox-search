#!/usr/bin/env sh

set -e

TARGET=$1
VERSION=$2

if [ -z "$TARGET" ]; then
    echo "No target."
    exit 1
fi

if [ -z "$VERSION" ]; then
    echo "No version."
    exit 1
fi

if [ -z "$DOCKER_CMD" ]; then
    DOCKER_CMD=docker
fi

if [ -z "$SKIP_DOCKER_IMAGE_BUILD" ]; then
    SKIP_DOCKER_IMAGE_BUILD=0
fi

if [ "$TARGET" = "chrome" ]; then
    OUT=chrome.zip
elif [ "$TARGET" = "firefox" ]; then
    echo "Firefox is currently not supported."
    exit 1
else
    echo "Unknown target."
    exit 1
fi

if [ -f "$OUT" ]; then
    echo "$OUT already exists. Please remove it first."
    exit 1
fi


###
echo "target: $TARGET"
echo "version: $VERSION"
echo "out: $OUT"
echo "docker command: $DOCKER_CMD"
echo "skip docker image build: $SKIP_DOCKER_IMAGE_BUILD"
echo ""


### Replace versions in package.json, package-lock.json, manifest.json.
echo "Replacing versions... $VERSION"
VERSION_REGEX_MATCH='^  "version": "[^"]+",$'
VERSION_REGEX_REPLACE="  \"version\": \"$VERSION\","
sed -i -r "s/$VERSION_REGEX_MATCH/$VERSION_REGEX_REPLACE/" package.json
sed -i -r "s/$VERSION_REGEX_MATCH/$VERSION_REGEX_REPLACE/" package-lock.json
sed -i -r "s/$VERSION_REGEX_MATCH/$VERSION_REGEX_REPLACE/" manifest.json

git diff --numstat
echo ""


### Build a docker image.
DOCKER_IMAGE_NAME="my/backlog-omnibox-search-build:$VERSION"
if [ $SKIP_DOCKER_IMAGE_BUILD -eq 0 ]; then
    echo "Building docker image... $DOCKER_IMAGE_NAME"
    $DOCKER_CMD build -t $DOCKER_IMAGE_NAME .
else
    echo 'Skip building docker image.'
fi
echo ""


### Run the docker image and build app.
echo 'Building app...'
DOCKER_CONTAINER_ID=$($DOCKER_CMD run -d --rm $DOCKER_IMAGE_NAME)

stop_docker_container () {
    echo "Stopping docker container... $DOCKER_CONTAINER_ID"
    $DOCKER_CMD stop $DOCKER_CONTAINER_ID
}

$DOCKER_CMD exec -t $DOCKER_CONTAINER_ID /bin/sh -c "node script/prepare.js $TARGET" || (stop_docker_container && false)
$DOCKER_CMD exec -t $DOCKER_CONTAINER_ID /bin/sh -c "npm run build" || (stop_docker_container && false)

# $DOCKER_CMD cp $DOCKER_CONTAINER_ID:/root/dist release/ || (stop_docker_container && false)
# $DOCKER_CMD cp $DOCKER_CONTAINER_ID:/root/icon release/ || (stop_docker_container && false)

if [ "$TARGET" = "chrome" ]; then
    $DOCKER_CMD exec -t $DOCKER_CONTAINER_ID /bin/sh -c "mkdir release && cp -R dist icon manifest.json release" \
        || (stop_docker_container && false)
    $DOCKER_CMD exec -t $DOCKER_CONTAINER_ID /bin/sh -c "cd release && zip -r chrome.zip *" || (stop_docker_container && false)
    $DOCKER_CMD cp $DOCKER_CONTAINER_ID:/root/release/chrome.zip $OUT || (stop_docker_container && false)
fi

stop_docker_container
echo ""


###
echo "All done!! The artifact is '$OUT'."
echo ""
echo "NOTE: Docker image '$DOCKER_IMAGE_NAME' still exists. Please remove it manually."
echo "NOTE: Some files are changed. Please check the diff and commit them."
