#!/bin/bash

set -e

npm prune --production
docker build -t ${DOCKER_IMAGE}:${TRAVIS_BUILD_NUMBER} .
docker push ${DOCKER_IMAGE}:${TRAVIS_BUILD_NUMBER}

gcloud auth activate-service-account --key-file=gke-service-account.json
gcloud config set project emblica-212815
gcloud config set compute/region europe-north1
gcloud container clusters get-credentials emblica-cluster-1

kubectl version
kubectl set image deployment/${K8S_DEPLOYMENT_NAME} ${K8S_DEPLOYMENT_NAME}=${DOCKER_IMAGE}:${TRAVIS_BUILD_NUMBER}