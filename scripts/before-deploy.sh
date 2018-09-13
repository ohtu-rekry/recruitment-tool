#!/bin/bash

set -e

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

openssl aes-256-cbc -K $encrypted_127facfaf176_key -iv $encrypted_127facfaf176_iv -in ../gke-service-account.json.enc -out gke-service-account.json -d

if [ ! -d "$HOME/google-cloud-sdk/bin" ]; then
  rm -rf $HOME/google-cloud-sdk;
  curl https://sdk.cloud.google.com | bash >/dev/null;
fi

source /home/travis/google-cloud-sdk/path.bash.inc

gcloud --quiet version
gcloud --quiet components update
gcloud --quiet components install kubectl
