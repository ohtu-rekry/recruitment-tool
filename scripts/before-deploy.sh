#!/bin/bash

set -e

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

openssl aes-256-cbc -K $encrypted_127facfaf176_key -iv $encrypted_127facfaf176_iv -in ../gke-service-account.json.enc -out gke-service-account.json -d

if [ ! -d ${HOME}/google-cloud-sdk/bin ]; then
  rm -rf ${HOME}/google-cloud-sdk;
  curl https://sdk.cloud.google.com | bash >/dev/null;
fi

source ${HOME}/google-cloud-sdk/path.bash.inc

gcloud --quiet version

curl -Lo kubectl https://storage.googleapis.com/kubernetes-release/release/v1.7.0/bin/linux/amd64/kubectl
chmod +x kubectl
sudo mv kubectl /usr/local/bin/