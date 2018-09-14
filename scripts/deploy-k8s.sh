#!/bin/bash

set -e

npm prune --production

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

openssl aes-256-cbc -K $encrypted_127facfaf176_key -iv $encrypted_127facfaf176_iv -in ../gke-service-account.json.enc -out gke-service-account.json -d

if [ ! -d ${HOME}/google-cloud-sdk/bin ]; then
  rm -rf ${HOME}/google-cloud-sdk;
  curl https://sdk.cloud.google.com | bash >/dev/null;
fi

source ${HOME}/google-cloud-sdk/path.bash.inc

gcloud components update kubectl

docker build -t ${DOCKER_IMAGE}:${TRAVIS_BUILD_NUMBER} .
docker push ${DOCKER_IMAGE}:${TRAVIS_BUILD_NUMBER}

gcloud auth activate-service-account --key-file=gke-service-account.json
gcloud config set project emblica-212815
gcloud config set compute/region europe-north1
gcloud container clusters get-credentials emblica-cluster-1 --region europe-north1

kubectl version
kubectl set image deployment/${K8S_DEPLOYMENT_NAME} ${K8S_DEPLOYMENT_NAME}=${DOCKER_IMAGE}:${TRAVIS_BUILD_NUMBER}