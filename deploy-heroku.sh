#!/bin/bash

npm install
npm run lint
npm run test
npm run nais-build

# Build docker image
docker build -t sykepengesoknad -f Dockerfile.web --build-arg BASE_IMAGE_PREFIX=node .

# Push docker image
heroku container:push web -a sykepengesoknad --recursive

# Release image
heroku container:release web -a sykepengesoknad
