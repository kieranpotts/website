#
# Dockerfile
#
# Provides a containerized development environment for the website. The image is
# based on the official Node.js slim variant of Debian bookworm, which keeps the
# image small while providing a stable Linux base. The Node version matches
# .nvmrc.
#
# Usage:
#   docker compose build
#
# Use the scripts in ./run/ to execute project tasks inside the container.
#

FROM node:22.13.0-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
