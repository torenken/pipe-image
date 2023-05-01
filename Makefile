SHELL := /bin/bash

.DEFAULT_GOAL := all
all: build

# ==============================================================================
# Install dependencies

dev-gotooling:
	go install golang.org/x/vuln/cmd/govulncheck@latest

# ==============================================================================
# Building lambdas

AWS_PROFILE := # configure aws profile here

NAME := pipe-image
LAMBDA_DIR := ./app/services
BUILD_DIR := ./build

# List of aws lambda functions (see services folder)
ALL_LAMBDAS := \
	hello-world

build: $(addprefix build-, $(ALL_LAMBDAS))

build-%:
	CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-s -w" -o ${BUILD_DIR}/$*/bootstrap ${LAMBDA_DIR}/$*

zip-%:
	zip -j ${BUILD_DIR}/$*/bootstrap.zip ${BUILD_DIR}/$*/bootstrap

deploy-%:
	aws lambda update-function-code --function-name ${NAME}-$* --zip-file fileb://${BUILD_DIR}/$*/bootstrap.zip --no-cli-pager --profile ${AWS_PROFILE}

# ==============================================================================
# Deploy lambda via aws cli

$(ALL_LAMBDAS):
	$(MAKE) build-$@
	$(MAKE) zip-$@
	$(MAKE) deploy-$@

# ==============================================================================
# Running tests within the local computer

test:
	CGO_ENABLED=0 go test -count=1 ./...
	CGO_ENABLED=0 go vet ./...
	govulncheck ./...

# ==============================================================================
# Go-Modules support

tidy:
	go mod tidy

deps-list:
	go list -m -u -mod=readonly all

deps-upgrade:
	go get -u -v ./...
	go mod tidy

# ==============================================================================
# CI support

ci-install: ci-enable-yarn ci-show-version

ci-enable-yarn:
	echo "enable yarn"
	@corepack enable

ci-show-version:
	@echo "build environment"
	@echo "node version: `node --version`, yarn version: `yarn --version`, `go version`"